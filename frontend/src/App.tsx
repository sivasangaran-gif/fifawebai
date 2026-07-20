import { useState, useEffect } from "react";
import {
  Layers,
  Map,
  Users,
  Train,
  Shield,
  Briefcase,
  Bot,
  FileText,
  Settings,
  Menu,
  X,
  Download,
  FileCheck
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Header } from "./components/Header";
import { StadiumHeatmap } from "./components/StadiumHeatmap";
import type { GateData } from "./components/StadiumHeatmap";
import { AIAlerts } from "./components/AIAlerts";
import { FacilitiesCamera } from "./components/FacilitiesCamera";
import { AIAssistant } from "./components/AIAssistant";
import { KPICards } from "./components/KPICards";
import { OpsCharts } from "./components/OpsCharts";
import { TransitSustainability } from "./components/TransitSustainability";
import { AlertsFeed } from "./components/AlertsFeed";

interface KPIData {
  matchStatus: string;
  attendance: number;
  capacity: number;
  occupancyRate: number;
  activeAlerts: number;
  weather: string;
  currentTime: string;
}

interface HistoryPoint {
  time: string;
  crowdDensity: number;
  powerDraw: number;
  waterFlow: number;
  wasteCapacity: number;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("livemap"); // dashboard, livemap, crowdanalytics, trafficparking, security, services, aiassistant, reports, settings
  const [chatOpen, setChatOpen] = useState(false);

  // Live telemetry states
  const [kpis, setKpis] = useState<KPIData>({
    matchStatus: "LIVE - 68'",
    attendance: 78129,
    capacity: 95000,
    occupancyRate: 82,
    activeAlerts: 3,
    weather: "25°C",
    currentTime: "07:45 PM",
  });

  const [gates, setGates] = useState<GateData[]>([
    { id: "gate_a", name: "Gate N (North)", status: "Normal", occupancy: 75, flowRate: 120, waitMinutes: 14 },
    { id: "gate_b", name: "Gate E (East)", status: "Critical", occupancy: 92, flowRate: 310, waitMinutes: 22 },
    { id: "gate_c", name: "Gate S (South)", status: "Critical", occupancy: 95, flowRate: 340, waitMinutes: 25 },
    { id: "gate_d", name: "Gate W (West)", status: "Normal", occupancy: 45, flowRate: 80, waitMinutes: 4 },
  ]);

  const [alerts, setAlerts] = useState<any[]>([
    { id: "alert_1", severity: "High", category: "Crowd", message: "Gate C crowd density exceeded 90% capacity. Dispatching volunteer team.", timestamp: "20:00:15", resolved: false },
    { id: "alert_2", severity: "Medium", category: "Transit", message: "Shuttle Bus Route 4 experiencing 10-minute delay due to traffic.", timestamp: "19:48:30", resolved: false },
    { id: "alert_3", severity: "Medium", category: "Sustainability", message: "Section 204 power usage spike detected. Cooling systems adjusting.", timestamp: "19:42:10", resolved: false },
    { id: "alert_4", severity: "High", category: "Security", message: "Unattended package reported near Gate B. Security unit en route.", timestamp: "19:30:00", resolved: true },
  ]);

  const [metricsHistory, setMetricsHistory] = useState<HistoryPoint[]>([
    { time: "18:00", crowdDensity: 65, powerDraw: 340, waterFlow: 180, wasteCapacity: 25 },
    { time: "18:30", crowdDensity: 70, powerDraw: 390, waterFlow: 220, wasteCapacity: 30 },
    { time: "19:00", crowdDensity: 75, powerDraw: 450, waterFlow: 290, wasteCapacity: 40 },
    { time: "19:30", crowdDensity: 80, powerDraw: 520, waterFlow: 310, wasteCapacity: 55 },
    { time: "20:00", crowdDensity: 82, powerDraw: 580, waterFlow: 350, wasteCapacity: 70 },
  ]);

  const syncTelemetry = async () => {
    try {
      const kpiRes = await fetch("/api/kpis");
      if (kpiRes.ok) {
        const kpiData = await kpiRes.json();
        // Parse raw timestamp into clock format
        const timeParts = kpiData.currentTime.split(":");
        let hh = parseInt(timeParts[0]);
        let mm = timeParts[1];
        let ampm = hh >= 12 ? "PM" : "AM";
        hh = hh % 12;
        hh = hh ? hh : 12; // 0 should be 12
        const formattedTime = `${hh.toString().padStart(2, "0")}:${mm} ${ampm}`;
        
        setKpis({
          matchStatus: kpiData.matchStatus,
          attendance: kpiData.attendance,
          capacity: kpiData.capacity,
          occupancyRate: Math.round(kpiData.occupancyRate),
          activeAlerts: kpiData.activeAlerts,
          weather: kpiData.weather.split(",")[0], // Keep temperature only
          currentTime: formattedTime,
        });
      }

      const gatesRes = await fetch("/api/gates");
      if (gatesRes.ok) {
        const gatesData = await gatesRes.json();
        setGates([
          { ...gatesData.find((g: any) => g.id === "gate_a"), name: "Gate N (North)" },
          { ...gatesData.find((g: any) => g.id === "gate_b"), name: "Gate E (East)" },
          { ...gatesData.find((g: any) => g.id === "gate_c"), name: "Gate S (South)" },
          { ...gatesData.find((g: any) => g.id === "gate_d"), name: "Gate W (West)" },
        ] as any);
      }

      const alertsRes = await fetch("/api/alerts");
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }

      const histRes = await fetch("/api/metrics-history");
      if (histRes.ok) {
        const histData = await histRes.json();
        setMetricsHistory(histData);
      }
    } catch (e) {
      console.warn("FastAPI backend connection offline. Falling back to local ticking simulation.");
      setKpis((prev) => {
        const change = Math.floor(Math.random() * 20) - 9;
        const newAtt = Math.max(77900, Math.min(prev.attendance + change, 78600));
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...prev,
          attendance: newAtt,
          occupancyRate: Math.round((newAtt / prev.capacity) * 100),
          currentTime: newTime,
        };
      });
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/alerts/${id}/resolve`, {
        method: "POST",
      });
      if (response.ok) {
        syncTelemetry();
      } else {
        throw new Error("Failed to resolve alert on backend");
      }
    } catch (e) {
      console.warn("Could not resolve alert on backend, resolving locally.", e);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
      );
    }
  };

  useEffect(() => {
    syncTelemetry();
    const interval = setInterval(syncTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  // Left sidebar navigation config matching reference
  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: Layers },
    { id: "livemap", name: "Live Map", icon: Map },
    { id: "crowdanalytics", name: "Crowd Analytics", icon: Users },
    { id: "trafficparking", name: "Traffic & Parking", icon: Train },
    { id: "security", name: "Security", icon: Shield },
    { id: "services", name: "Services", icon: Briefcase },
    { id: "aiassistant", name: "AI Assistant", icon: Bot },
    { id: "reports", name: "Reports", icon: FileText },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  // Convert history array into density values for sidebar line chart
  const densityHistory = metricsHistory.map((h) => ({ val: h.crowdDensity }));

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-gray-950 px-4 py-3 border-b border-gray-900 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xs font-bold text-white uppercase tracking-wider font-space">
            StadiumGPT <span className="text-brand-purple">AI</span>
          </span>
        </div>
        <span className="text-[10px] text-gray-500 font-bold">{kpis.currentTime}</span>
      </div>

      {/* 1. TOP HEADER BAR */}
      <Header
        attendance={kpis.attendance}
        occupancyRate={kpis.occupancyRate}
        avgWaitTime={gates[0]?.waitMinutes || 14}
        activeAlerts={kpis.activeAlerts}
        weather={kpis.weather}
        time={kpis.currentTime}
      />

      {/* 2. BODY LAYOUT GRID */}
      <div className="flex-1 flex relative">
        
        {/* LEFT SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 lg:sticky lg:top-16 z-30 w-60 bg-gray-950/95 border-r border-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col justify-between p-4 h-[calc(100vh-64px)]`}
        >
          {/* Nav List */}
          <div className="space-y-4">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block px-3">
              Operations Menu
            </span>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeModule === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveModule(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-brand-purple/15 text-brand-purple border-l-2 border-brand-purple"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/50"
                    }`}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Widgets: Overall Density & Legend */}
          <div className="space-y-4 border-t border-gray-900 pt-4">
            {/* Overall Crowd Density Widget */}
            <div className="bg-gray-900/40 border border-gray-900 rounded-xl p-3 relative overflow-hidden flex flex-col h-[105px] justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block leading-none mb-1">
                    Overall Crowd Density
                  </span>
                  <span className="text-xs font-bold text-brand-red uppercase leading-none">High</span>
                </div>
                <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                  {kpis.occupancyRate}%
                </span>
              </div>

              {/* Sparkline line graph */}
              <div className="h-10 w-full opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={densityHistory}>
                    <defs>
                      <linearGradient id="sideGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#f43f5e" strokeWidth={1.5} fill="url(#sideGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Density Legend */}
            <div className="bg-gray-900/10 border border-gray-900/50 rounded-xl p-3 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="text-gray-400">Low</span>
                </div>
                <span className="text-gray-500 font-semibold">0-50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                  <span className="text-gray-400">Moderate</span>
                </div>
                <span className="text-gray-500 font-semibold">50-80%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-red/80"></span>
                  <span className="text-gray-400">High</span>
                </div>
                <span className="text-gray-500 font-semibold">80-95%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                  <span className="text-gray-400">Very High</span>
                </div>
                <span className="text-gray-500 font-semibold">95-100%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* BACKDROP FOR MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          ></div>
        )}

        {/* MAIN DISPLAY CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Routing content based on sidebar items */}
          {activeModule === "dashboard" && (
            <div className="space-y-6">
              {/* KPI Strip */}
              <KPICards kpis={kpis} />

              {/* 3D Stadium Map Heatmap */}
              <StadiumHeatmap gates={gates} />
              
              {/* Mini Sparklines */}
              <OpsCharts history={metricsHistory} />
              <TransitSustainability />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AlertsFeed alerts={alerts} onResolveAlert={handleResolveAlert} />
                </div>
                <div className="glass-panel rounded-2xl p-5 border border-brand-purple/20">
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-brand-purple" />
                    <span>Operations Terminal</span>
                  </h3>
                  <AIAssistant />
                </div>
              </div>
            </div>
          )}

          {activeModule === "livemap" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Center map + bottom facilities & camera feeds) */}
              <div className="lg:col-span-9 space-y-6">
                <StadiumHeatmap gates={gates} />
                <FacilitiesCamera />
              </div>

              {/* Right Column (AI Alerts + radar + predictions) */}
              <div className="lg:col-span-3">
                <AIAlerts />
              </div>
            </div>
          )}

          {activeModule === "crowdanalytics" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                <Users className="w-5 h-5 text-brand-purple" />
                <span>Crowd Analytics Monitor</span>
              </h3>
              
              <OpsCharts history={metricsHistory} />
              <StadiumHeatmap gates={gates} />
            </div>
          )}

          {activeModule === "trafficparking" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                <Train className="w-5 h-5 text-brand-cyan" />
                <span>Traffic & Parking Telemetry</span>
              </h3>

              <TransitSustainability />
            </div>
          )}

          {activeModule === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-brand-red" />
                  <span>Security Systems Monitor</span>
                </h3>
                <FacilitiesCamera />
              </div>
              <div>
                <AlertsFeed alerts={alerts.filter(a => a.category === "Security" || a.severity === "High")} onResolveAlert={handleResolveAlert} />
              </div>
            </div>
          )}

          {activeModule === "services" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-brand-purple" />
                <span>Accessibility & Portal Services</span>
              </h3>

              <FacilitiesCamera />
              <TransitSustainability />
            </div>
          )}

          {activeModule === "aiassistant" && (
            <div className="max-w-4xl mx-auto py-6">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-space flex items-center space-x-2">
                <Bot className="w-5 h-5 text-brand-purple" />
                <span>StadiumGPT AI Dialogue Console</span>
              </h2>
              <AIAssistant />
            </div>
          )}

          {activeModule === "reports" && (
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brand-cyan" />
                <span>Operations Report Manager</span>
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                Download generated PDF compliance sheets and telemetry report matrices for FIFA World Cup 2026.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "MetLife Crowd Density Analysis.pdf", size: "4.8 MB", date: "20:00" },
                  { name: "Eco Grid Power Performance Log.pdf", size: "1.2 MB", date: "19:42" },
                  { name: "Public Transit Flow Coordinator.pdf", size: "2.5 MB", date: "19:30" },
                  { name: "Volunteer Allocation Final Ledger.pdf", size: "900 KB", date: "18:00" },
                ].map((rep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-900/40 border border-gray-800 rounded-xl hover:bg-gray-800/30 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                        <FileCheck className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-200 block truncate max-w-[200px]">{rep.name}</span>
                        <span className="text-[9px] text-gray-500">Size: {rep.size} • Time: {rep.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading: ${rep.name}`)}
                      className="p-2 rounded-lg bg-gray-800/80 border border-gray-700 hover:border-gray-500 hover:text-white transition-all text-gray-400 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "settings" && (
            <div className="glass-panel rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-space flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <span>System Operations Settings</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-gray-200 block">FastAPI Telemetry Proxy Endpoint</span>
                    <span className="text-[10px] text-gray-500">Address of the mock service</span>
                  </div>
                  <input
                    type="text"
                    value="http://localhost:8000"
                    disabled
                    className="bg-gray-900 border border-gray-800 text-xs px-3 py-1.5 rounded-lg text-gray-400 w-44 text-center"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-gray-200 block">Database Connectivity</span>
                    <span className="text-[10px] text-gray-500">MongoDB / JSON Fallback active connection</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-wider">
                    Online (Auto-fallback enabled)
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. FLOATING AI ASSISTANT CONSOLE (ACTIVE IN ALL VIEWS) */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple hover:scale-105 active:scale-95 flex items-center justify-center text-white border border-brand-cyan/25 shadow-[0_0_15px_rgba(6,182,212,0.45)] transition-all cursor-pointer"
        title="Chat with StadiumGPT AI"
      >
        {chatOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5 animate-pulse-slow" />}
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[350px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-brand-purple/20 rounded-2xl bg-brand-dark/95 backdrop-blur-lg animate-fade-in-up">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <AIAssistant />
        </div>
      )}
    </div>
  );
}
