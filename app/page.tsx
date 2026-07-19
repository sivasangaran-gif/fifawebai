"use client";

import React, { useState, useEffect } from "react";
import { Info, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import StatsCards from "@/components/StatsCards";
import StadiumHeatmap from "@/components/StadiumHeatmap";
import AIAssistant from "@/components/AIAssistant";
import DashboardCharts from "@/components/DashboardCharts";
import Transportation from "@/components/Transportation";
import Sustainability from "@/components/Sustainability";
import Accessibility from "@/components/Accessibility";
import OperationsAlerts, { AlertItem } from "@/components/OperationsAlerts";
import VolunteerCopilot from "@/components/VolunteerCopilot";

interface ToastMsg {
  id: string;
  message: string;
}

export default function DashboardPage() {
  // Gate Telemetry
  const gateTelemetry: Record<string, { density: number; power: number; water: number; waste: number }> = {
    'Global': { density: 87, power: 1.42, water: 18.6, waste: 68 },
    'Gate A': { density: 54, power: 0.85, water: 12.4, waste: 42 },
    'Gate B': { density: 82, power: 1.25, water: 16.8, waste: 71 },
    'Gate C': { density: 35, power: 0.52, water: 6.2,  waste: 28 },
    'Gate D': { density: 94, power: 1.82, water: 22.4, waste: 89 },
    'Gate E': { density: 62, power: 0.98, water: 10.5, waste: 55 }
  };

  // State Management
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState(gateTelemetry.Global);
  const [chatTrigger, setChatTrigger] = useState<string | null>(null);
  const [showLogsSidebar, setShowLogsSidebar] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // Alerts array
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      title: "High Crowd Density - Block D12",
      desc: "Sectors near Gate D filling up quickly",
      priority: "High",
      timestamp: "2m ago"
    },
    {
      id: "2",
      title: "Medical Assistance - Block C12",
      desc: "Responder dispatched to Row 18",
      priority: "Medium",
      timestamp: "5m ago"
    },
    {
      id: "3",
      title: "Waste Capacity Warning - Zone E",
      desc: "Recycle bin capacity at 90%",
      priority: "Medium",
      timestamp: "8m ago"
    },
    {
      id: "4",
      title: "Power Usage Above Normal - Sector 12",
      desc: "Telemetry wattage draw alert",
      priority: "High",
      timestamp: "12m ago"
    }
  ]);

  // Toast dispatch engine
  const triggerToast = (message: string) => {
    const id = "toast-" + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Selected Gate changes update local telemetry and fires toast
  const handleSelectGate = (gateName: string | null) => {
    setSelectedGate(gateName);
    const key = gateName || "Global";
    setTelemetry(gateTelemetry[key]);
    
    if (gateName) {
      triggerToast(`Inspecting ${gateName}. Showing local telemetry analytics.`);
    } else {
      triggerToast("Viewing Global Arena Analytics Dashboard.");
    }
  };

  // Chat action triggers prompts to AI Chatbot
  const handleChatAction = (promptText: string) => {
    setChatTrigger(promptText);

    // Mock intercept special queries to update telemetry state / add alerts
    const q = promptText.toLowerCase();
    if (q.includes("medical")) {
      addNewAlert("Medical Team Dispatch", "Block C12 Responder dispatched", "High");
    } else if (q.includes("exit")) {
      triggerToast("Evacuation route calculated. Forwarded exits map to volunteers.");
    }
  };

  const addNewAlert = (title: string, desc: string, priority: "High" | "Medium") => {
    const newAlert: AlertItem = {
      id: Math.random().toString(),
      title,
      desc,
      priority,
      timestamp: "Just now"
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerToast(`New Critical Alert: ${title}`);
  };

  const handleClearAlerts = () => {
    setAlerts([]);
    triggerToast("Cleared all historical operations alerts.");
  };

  // Fluctuating real-time stats ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const fluctuate = (val: number, range: number) => 
          +(val + (Math.random() - 0.5) * range).toFixed(2);
        return {
          density: Math.min(100, Math.max(10, fluctuate(prev.density, 1.5))),
          power: Math.min(3.0, Math.max(0.1, fluctuate(prev.power, 0.05))),
          water: Math.min(40.0, Math.max(1.0, fluctuate(prev.water, 0.4))),
          waste: Math.min(100, Math.max(5, fluctuate(prev.waste, 0.8)))
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex z-10">
      
      {/* LEFT SIDEBAR */}
      <Sidebar
        onSelectGate={handleSelectGate}
        selectedGate={selectedGate}
        onOpenModal={setActiveModal}
        onOpenAlerts={setShowLogsSidebar}
        onChatAction={handleChatAction}
        onToast={triggerToast}
      />

      {/* WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 z-20">
        
        {/* TOP NAVIGATION BAR */}
        <TopNavbar
          onOpenAlerts={setShowLogsSidebar}
          onToast={triggerToast}
          alertCount={alerts.length}
        />

        {/* WORKSPACE MAIN BODY SCROLLABLE */}
        <div className="flex-1 p-6 overflow-y-auto custom-scroll relative">
          
          {/* TOP STATISTICS METRIC CARDS */}
          <StatsCards
            attendance={72190 + (selectedGate ? Math.floor((Math.random() - 0.5) * 80) : 0)}
            occupancy={Math.round(telemetry.density)}
            alertCount={alerts.length}
          />

          {/* MIDDLE GRID: HEATMAP & CHAT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <StadiumHeatmap
                onSelectGate={handleSelectGate}
                selectedGate={selectedGate}
                onToast={triggerToast}
              />
            </div>
            <div>
              <AIAssistant
                onToast={triggerToast}
                chatTrigger={chatTrigger}
                onChatTriggerConsumed={() => setChatTrigger(null)}
              />
            </div>
          </div>

          {/* TELEMETRY CHARTS */}
          <DashboardCharts telemetry={telemetry} />

          {/* TRIPLE SPLIT OPERATIONAL WIDGETS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Transportation onToast={triggerToast} />
            <Sustainability onToast={triggerToast} telemetry={telemetry} />
            <Accessibility onToast={triggerToast} />
          </div>

          {/* ALERTS & VOLUNTEER COPILOT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <OperationsAlerts
              alerts={alerts}
              onClearAlerts={handleClearAlerts}
              showSidebar={showLogsSidebar}
              onCloseSidebar={() => setShowLogsSidebar(false)}
              onOpenSidebar={() => setShowLogsSidebar(true)}
            />
            <VolunteerCopilot
              onToast={triggerToast}
              onChatAction={handleChatAction}
            />
          </div>

          {/* FOOTER */}
          <footer className="mt-8 pt-6 border-t border-navy-border text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <p className="font-semibold text-gray-300">StadiumGPT AI · FIFA World Cup 2026 Operations Dashboard</p>
              <p className="text-[10px] text-gray-500 mt-1">Smart Stadium. Better Experience. One AI Assistant.</p>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => triggerToast("Loading Privacy Policy...")} className="hover:text-neon-cyan transition-colors">Privacy Policy</button>
              <button onClick={() => triggerToast("Loading Terms of Service...")} className="hover:text-neon-cyan transition-colors">Terms of Service</button>
              <button onClick={() => triggerToast("Opening Support Ticket...")} className="hover:text-neon-cyan transition-colors">Contact Support</button>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">© 2026 StadiumGPT Inc. All rights reserved.</p>
            </div>
          </footer>

        </div>
      </main>

      {/* TOAST SYSTEM WRAPPER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center p-3 bg-navy-card/95 border border-neon-cyan/40 hover:border-neon-cyan text-white text-xs font-semibold rounded-xl shadow-xl w-72 animate-toast transition-all"
          >
            <div className="mr-3 p-1.5 bg-neon-cyan/10 rounded-lg text-neon-cyan">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* OVERLAY MODALS */}
      {activeModal === "tournament-modal" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-navy-card border border-navy-border rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl relative"
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 hover:bg-navy-dark rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-poppins text-neon-cyan mb-2">FIFA World Cup 2026 Overview</h3>
            <p className="text-xs text-gray-400 mb-4">
              Operations are split across three host nations and sixteen state-of-the-art stadiums. Here is the active command console details.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-navy-dark/50 border border-navy-border rounded-xl">
                <p className="text-gray-400">Host Cities</p>
                <p className="text-sm font-bold text-white mt-1">16 Cities</p>
              </div>
              <div className="p-3 bg-navy-dark/50 border border-navy-border rounded-xl">
                <p className="text-gray-400">Total Teams</p>
                <p className="text-sm font-bold text-white mt-1">48 Nations</p>
              </div>
              <div className="p-3 bg-navy-dark/50 border border-navy-border rounded-xl">
                <p className="text-gray-400">Match Count</p>
                <p className="text-sm font-bold text-white mt-1">104 Matches</p>
              </div>
              <div className="p-3 bg-navy-dark/50 border border-navy-border rounded-xl">
                <p className="text-gray-400">Active Volunteers</p>
                <p className="text-sm font-bold text-white mt-1">45,000 Staff</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-xs font-bold rounded-xl shadow-lg shadow-neon-purple/20 transition-all text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
