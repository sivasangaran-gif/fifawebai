"use client";

import React from "react";
import { AlertCircle, Users, Heart, Trash2, ShieldAlert, X, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface AlertItem {
  id: string;
  title: string;
  desc: string;
  priority: "High" | "Medium" | "Info";
  timestamp: string;
}

interface OperationsAlertsProps {
  alerts: AlertItem[];
  onClearAlerts: () => void;
  showSidebar: boolean;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
}

export default function OperationsAlerts({
  alerts,
  onClearAlerts,
  showSidebar,
  onCloseSidebar,
  onOpenSidebar
}: OperationsAlertsProps) {
  
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("crowd")) return Users;
    if (t.includes("medical")) return Heart;
    if (t.includes("waste")) return Trash2;
    return Bell;
  };

  return (
    <>
      {/* Primary Alerts card */}
      <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-5 backdrop-blur-md flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-navy-border/40 pb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-neon-red" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Operations Alerts</h3>
            </div>
            <button 
              onClick={onOpenSidebar} 
              className="text-[9px] font-bold text-neon-purple hover:underline uppercase"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((item) => {
              const Icon = getIcon(item.title);
              const isHigh = item.priority === "High";
              const priorityColor = isHigh ? "neon-red" : "neon-yellow";
              const borderStyle = isHigh ? "border-l-neon-red" : "border-l-neon-yellow";

              return (
                <div
                  key={item.id}
                  className={`p-2.5 bg-navy-dark/50 border-l-2 ${borderStyle} border-y border-r border-navy-border rounded-r-xl flex items-center justify-between transition-all`}
                >
                  <div className="flex items-center space-x-3 text-xs">
                    <div className={`w-7 h-7 rounded-lg bg-${priorityColor}/10 flex items-center justify-center text-${priorityColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-[9px] text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded bg-${priorityColor}/15 text-${priorityColor} border border-${priorityColor}/20 text-[9px] font-bold uppercase`}>
                      {item.priority}
                    </span>
                    <p className="text-[8px] text-gray-500 mt-1">{item.timestamp}</p>
                  </div>
                </div>
              );
            })}
            {alerts.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">No active alerts.</p>
            )}
          </div>
        </div>
      </div>

      {/* Historical logs sidebar sliding overlay drawer */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseSidebar}
              className="fixed inset-0 bg-navy-dark/65 backdrop-blur-sm z-40"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[400px] bg-navy-card border-l border-navy-border shadow-2xl p-6 z-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-navy-border pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 text-neon-red" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Historical Operations Log
                    </h3>
                  </div>
                  <button
                    onClick={onCloseSidebar}
                    className="p-1 hover:bg-navy-dark rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1 custom-scroll">
                  {alerts.map((item) => {
                    const isHigh = item.priority === "High";
                    const isMedium = item.priority === "Medium";
                    const badgeStyle = isHigh
                      ? "bg-neon-red/10 border-neon-red/20 text-neon-red"
                      : isMedium
                      ? "bg-neon-yellow/10 border-neon-yellow/20 text-neon-yellow"
                      : "bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan";

                    return (
                      <div key={item.id} className="p-3 bg-navy-dark/50 border border-navy-border rounded-xl">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-white">{item.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${badgeStyle}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">{item.desc}</p>
                        <span className="text-[8px] text-gray-500 mt-2 block">
                          {item.timestamp}
                        </span>
                      </div>
                    );
                  })}
                  {alerts.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-12">
                      Historical log cleared. No active alerts.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClearAlerts}
                className="w-full py-2.5 bg-navy-dark/80 hover:bg-navy-dark border border-navy-border hover:border-neon-red/35 hover:text-neon-red text-xs font-bold rounded-xl transition-all"
              >
                Clear All Logs
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
