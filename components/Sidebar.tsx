"use client";

import React from "react";
import { 
  LayoutDashboard, Map, Users, Navigation, Bus, Leaf, 
  Accessibility, AlertTriangle, UserCheck, BarChart3, Settings, Cpu, ArrowRight 
} from "lucide-react";

interface SidebarProps {
  onSelectGate: (gateName: string | null) => void;
  selectedGate: string | null;
  onOpenModal: (modalId: string) => void;
  onOpenAlerts: (show: boolean) => void;
  onChatAction: (promptText: string) => void;
  onToast: (msg: string) => void;
}

export default function Sidebar({
  onSelectGate,
  selectedGate,
  onOpenModal,
  onOpenAlerts,
  onChatAction,
  onToast
}: SidebarProps) {
  
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, action: () => onSelectGate(null), activeMatch: selectedGate === null },
    { name: "Stadium Map", icon: Map, action: () => onSelectGate("Gate C") },
    { name: "Crowd Management", icon: Users, action: () => onSelectGate("Gate D") },
    { name: "AI Navigation", icon: Navigation, action: () => onChatAction("Nearest emergency exit") },
    { name: "Transportation", icon: Bus, action: () => onChatAction("Shuttle schedule") },
    { name: "Sustainability", icon: Leaf, action: () => onToast("Loading Sustainability Dashboard...") },
    { name: "Accessibility", icon: Accessibility, action: () => onToast("Loading Accessibility Console...") },
    { name: "Emergency", icon: AlertTriangle, action: () => onOpenAlerts(true) },
    { name: "Volunteers", icon: UserCheck, action: () => onChatAction("Check volunteer shifts") },
    { name: "Reports", icon: BarChart3, action: () => onToast("Generating Reports...") },
    { name: "Settings", icon: Settings, action: () => onToast("Loading Telemetry Settings...") }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-navy-dark/60 backdrop-blur-xl border-r border-navy-border flex flex-col justify-between p-5 transition-all duration-300 z-30">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-cyan p-[1px] shadow-lg shadow-neon-purple/20">
            <div className="flex items-center justify-center w-full h-full bg-navy-dark rounded-xl">
              <Cpu className="w-5 h-5 text-neon-cyan" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-neon-cyan"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold font-poppins tracking-wide leading-none">
              StadiumGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">AI</span>
            </h1>
            <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase">FIFA World Cup 2026</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.activeMatch !== undefined ? item.activeMatch : false;
            return (
              <button
                key={idx}
                onClick={item.action}
                className={`w-full nav-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive ? "nav-item-active" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-neon-cyan" : "text-gray-400 group-hover:text-neon-cyan"}`} />
                  <span>{item.name}</span>
                </div>
                {item.name === "Overview" && (
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Showcase Card */}
      <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-card to-navy-dark border border-navy-border p-4 text-center group">
        <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <img 
            src="/assets/images/trophy.png" 
            alt="FIFA Trophy" 
            className="w-16 h-20 object-contain mb-3 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neon-yellow">FIFA World Cup 2026</h3>
          <p className="text-[9px] text-gray-400 mt-1 mb-3">UNITED STATES · CANADA · MEXICO</p>
          <button 
            onClick={() => onOpenModal("tournament-modal")} 
            className="w-full py-2 bg-gradient-to-r from-neon-purple to-indigo-600 hover:from-neon-purple hover:to-indigo-500 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all shadow-md shadow-neon-purple/20 hover:shadow-neon-purple/40"
          >
            View Tournament
          </button>
        </div>
      </div>
    </aside>
  );
}
