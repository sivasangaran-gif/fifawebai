import React from "react";
import { AlertCircle, ShieldAlert, Sparkles, Send, Users, CheckCircle, RefreshCw } from "lucide-react";

export interface AlertData {
  id: string;
  severity: "High" | "Medium";
  category: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface AlertsFeedProps {
  alerts: AlertData[];
  onResolveAlert?: (id: string) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts, onResolveAlert }) => {
  
  const handleVolunteerAction = (action: string) => {
    alert(`Volunteer Command Dispatched: "${action}". Volunteer dispatch logs updated.`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Operations Alerts Feed */}
      <div className="xl:col-span-2 glass-panel rounded-2xl p-5 flex flex-col justify-between h-[380px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Operations Alerts Feed</h3>
              <p className="text-xs text-gray-400">Real-time system anomalies & incident logging</p>
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center space-x-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Live Synced</span>
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[250px] pr-1 scrollbar-thin">
            {alerts.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-8">
                No active anomalies detected. All systems operating within normal parameters.
              </div>
            ) : (
              alerts.map((alertItem) => {
                const isHigh = alertItem.severity === "High";
                const isResolved = alertItem.resolved;

                return (
                  <div
                    key={alertItem.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isResolved
                        ? "bg-gray-950/20 border-gray-800/40 opacity-60"
                        : isHigh
                        ? "bg-brand-red/5 border-brand-red/20 hover:bg-brand-red/10"
                        : "bg-brand-orange/5 border-brand-orange/20 hover:bg-brand-orange/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg border ${
                        isResolved
                          ? "bg-gray-800 border-gray-700 text-gray-500"
                          : isHigh
                          ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                          : "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                      }`}>
                        {isHigh ? <ShieldAlert className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            isResolved ? "text-gray-500" : isHigh ? "text-brand-red" : "text-brand-orange"
                          }`}>
                            {alertItem.category} • {alertItem.severity}
                          </span>
                          <span className="text-[9px] text-gray-500">{alertItem.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-300 font-medium mt-0.5">{alertItem.message}</p>
                      </div>
                    </div>

                    {!isResolved && onResolveAlert && (
                      <button
                        onClick={() => onResolveAlert(alertItem.id)}
                        className="px-2.5 py-1 text-[9px] font-bold rounded-lg border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-all cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}
                    {isResolved && (
                      <span className="text-[9px] text-brand-green font-bold flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="text-[10px] text-gray-500 pt-4 border-t border-gray-800/50 mt-2">
          Note: High priority security incidents are auto-forwarded to local emergency responder dispatch systems.
        </div>
      </div>

      {/* Volunteer AI Copilot Card */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[380px] scanner-container">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <h3 className="text-base font-bold text-white">Volunteer AI Copilot</h3>
            </div>
            <span className="text-[9px] text-brand-purple border border-brand-purple/20 bg-brand-purple/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              142 Active Staff
            </span>
          </div>

          {/* Mascot Row */}
          <div className="flex items-center space-x-4 bg-gray-950/40 border border-gray-800/60 p-3 rounded-xl mb-4">
            <img
              src="/mascot.png"
              alt="StadiumGPT AI Mascot"
              className="w-14 h-14 rounded-xl border border-brand-purple/25 bg-gray-900 object-cover"
            />
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-200 block mb-0.5">Mascot Steward Assist</span>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                "Crowd alerts active at Gate C. We suggest dispatching 5 floaters to entry lanes for ticket-scanning support."
              </p>
            </div>
          </div>

          {/* Quick-action chips */}
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              Recommended Commands
            </span>
            <button
              onClick={() => handleVolunteerAction("Deploy 5 support volunteers to Gate C")}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/20 text-xs font-bold text-brand-purple transition-all text-left"
            >
              <span>Deploy 5 to Gate C Support</span>
              <Send className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleVolunteerAction("Send breather rotations to Gate B & E")}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700/80 border border-gray-700/50 text-xs font-semibold text-gray-300 transition-all text-left"
            >
              <span>Send Gate B/E Breather Rotations</span>
              <Users className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleVolunteerAction("Broadcast transit warning notification to volunteers")}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700/80 border border-gray-700/50 text-xs font-semibold text-gray-300 transition-all text-left"
            >
              <span>Broadcast Shuttle 4 Transit Alert</span>
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-[9px] text-gray-500 pt-3 border-t border-gray-800/50">
          AI Copilot dynamically distributes stewards based on ticketing and crowd density telemetry.
        </div>
      </div>
    </div>
  );
};
