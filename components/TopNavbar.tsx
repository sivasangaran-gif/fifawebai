"use client";

import React, { useState } from "react";
import { Search, Bell, AlertTriangle, Heart, Trash2 } from "lucide-react";

interface TopNavbarProps {
  onOpenAlerts: (show: boolean) => void;
  onToast: (msg: string) => void;
  alertCount: number;
}

export default function TopNavbar({ onOpenAlerts, onToast, alertCount }: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 border-b border-navy-border bg-navy-dark/40 backdrop-blur-xl flex items-center justify-between px-8 z-30">
      {/* Breadcrumbs & Search */}
      <div className="flex items-center space-x-12">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <a href="#" className="text-white hover:text-neon-cyan transition-colors">Dashboard</a>
          <span>/</span>
          <a href="#" className="hover:text-neon-cyan transition-colors">Operations</a>
          <span>/</span>
          <span className="text-neon-purple">Overview</span>
        </div>

        {/* Search Input */}
        <div className="relative w-64 hidden lg:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-12 py-2 bg-navy-card/50 border border-navy-border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-navy-dark text-[9px] font-bold text-gray-400 border border-navy-border select-none">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-6">
        {/* Quick Tabs */}
        <div className="hidden xl:flex items-center space-x-1 bg-navy-card/40 border border-navy-border p-1 rounded-xl">
          <button className="px-3 py-1.5 bg-neon-purple/20 border border-neon-purple/30 text-xs font-semibold rounded-lg text-neon-cyan shadow-sm shadow-neon-purple/10">
            Dashboard
          </button>
          <button
            onClick={() => onToast("Loading Sustainability Console...")}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Sustainability
          </button>
          <button
            onClick={() => onToast("Loading Analytics Console...")}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Analytics
          </button>
        </div>

        {/* Notification Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-navy-card/50 hover:bg-navy-card border border-navy-border rounded-xl transition-all relative group"
          >
            <Bell className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
            {alertCount > 0 && (
              <span className="absolute top-[-2px] right-[-2px] flex h-4 w-4 items-center justify-center rounded-full bg-neon-red text-[8px] font-bold text-white border-2 border-navy">
                {alertCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-navy-card/95 backdrop-blur-xl border border-navy-border rounded-2xl shadow-2xl p-4 z-40 transition-all">
              <div className="flex items-center justify-between mb-3 border-b border-navy-border pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Operations Alerts</h4>
                <span className="text-[9px] font-bold text-neon-red uppercase">{alertCount} Active</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                <div className="p-2 rounded-lg bg-neon-red/10 border border-neon-red/20 flex space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-neon-red flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="text-[10px] font-semibold text-white">High Crowd Density - Block D12</p>
                    <span className="text-[8px] text-gray-400">2 minutes ago</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20 flex space-x-2.5">
                  <Heart className="w-4 h-4 text-neon-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-white">Medical Assistance - Block C12</p>
                    <span className="text-[8px] text-gray-400">5 minutes ago</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20 flex space-x-2.5">
                  <Trash2 className="w-4 h-4 text-neon-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-white">Waste Capacity Warning - Zone E</p>
                    <span className="text-[8px] text-gray-400">8 minutes ago</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onOpenAlerts(true);
                }}
                className="w-full text-center mt-3 text-[10px] font-bold uppercase text-neon-purple hover:text-neon-purple/80 transition-colors pt-2 border-t border-navy-border"
              >
                View Historical Log
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center space-x-3 border-l border-navy-border pl-6">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-neon-purple to-neon-cyan p-[1px]">
            <div className="w-full h-full bg-navy rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold leading-tight">Admin User</h4>
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
