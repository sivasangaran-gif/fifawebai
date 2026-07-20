import React from "react";
import { AlertCircle, ShieldAlert, Navigation } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const AIAlerts: React.FC = () => {
  // Congestion prediction chart data
  const predictionData = [
    { time: "Now", occupancy: 82 },
    { time: "+10m", occupancy: 85 },
    { time: "+20m", occupancy: 91 },
    { time: "+30m", occupancy: 95 },
  ];

  return (
    <div className="flex flex-col space-y-6">
      {/* 1. AI Alerts Widget */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Alerts</h3>
          <span className="text-[10px] text-brand-red font-bold uppercase tracking-widest">3 Active</span>
        </div>

        <div className="space-y-3">
          {/* Card 1: High Congestion */}
          <div className="p-3 bg-gray-900/40 border border-brand-red/15 hover:border-brand-red/30 rounded-xl transition-all">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-brand-red/10 text-brand-red">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">High Congestion</span>
              </div>
              <span className="text-[9px] text-gray-500 font-semibold">7:45 PM</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-7">
              Sector C (South) will reach <span className="text-brand-red font-semibold">95% occupancy</span> in 8 mins.
            </p>
          </div>

          {/* Card 2: Long Wait Time */}
          <div className="p-3 bg-gray-900/40 border border-brand-orange/15 hover:border-brand-orange/30 rounded-xl transition-all">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-brand-orange/10 text-brand-orange">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Long Wait Time</span>
              </div>
              <span className="text-[9px] text-gray-500 font-semibold">7:43 PM</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-7">
              Food Court 2. Average wait: <span className="text-brand-orange font-semibold">18 min</span>.
            </p>
          </div>

          {/* Card 3: Traffic Update */}
          <div className="p-3 bg-gray-900/40 border border-brand-blue/15 hover:border-brand-blue/30 rounded-xl transition-all">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-brand-blue/10 text-brand-cyan">
                  <Navigation className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Traffic Update</span>
              </div>
              <span className="text-[9px] text-gray-500 font-semibold">7:40 PM</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-7">
              Slow movement at Gate E Parking Area.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Crowd Flow Radar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crowd Flow</h3>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Live Movement</span>
        </div>

        {/* Circular Radar Simulation */}
        <div className="flex flex-col items-center py-4 bg-gray-900/20 border border-gray-900/50 rounded-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-brand-cyan/5 animate-pulse-slow"></div>
          
          <svg viewBox="0 0 100 100" className="w-36 h-36">
            {/* outer rings */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
            
            {/* Seating outline rings with color sweep */}
            {/* Sector West: Green */}
            <path d="M 50 15 A 35 35 0 0 0 15 50 L 25 50 A 25 25 0 0 1 50 25 Z" fill="none" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.4" />
            {/* Sector North: Yellow */}
            <path d="M 15 50 A 35 35 0 0 0 50 85 L 50 75 A 25 25 0 0 1 25 50 Z" fill="none" stroke="#f97316" strokeWidth="2.5" strokeOpacity="0.5" />
            {/* Sector East: Red */}
            <path d="M 50 85 A 35 35 0 0 0 85 50 L 75 50 A 25 25 0 0 1 50 75 Z" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.75" />
            {/* Sector South: Red */}
            <path d="M 85 50 A 35 35 0 0 0 50 15 L 50 25 A 25 25 0 0 1 75 50 Z" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.75" />

            {/* Pitch center */}
            <rect x="42" y="44" width="16" height="12" rx="1" fill="#0b172a" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="3" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5" />

            {/* Radar scanner line */}
            <line x1="50" y1="50" x2="80" y2="20" stroke="#06b6d4" strokeWidth="0.75" strokeDasharray="1 1" className="origin-center animate-spin" style={{ animationDuration: "5s" }} />
          </svg>

          {/* Color bar legend */}
          <div className="flex space-x-4 mt-4 text-[9px] font-semibold uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-1 bg-brand-green rounded-full"></span>
              <span className="text-gray-400">Low</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-1 bg-brand-orange rounded-full"></span>
              <span className="text-gray-400">Medium</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-1 bg-brand-red rounded-full"></span>
              <span className="text-gray-400">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Congestion Prediction Widget */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[180px] relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Congestion Prediction</h3>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Next 30 Minutes</span>
          </div>
          <span className="text-2xl font-black text-brand-red tracking-tight leading-none glow-text-red">95%</span>
        </div>

        {/* Prediction area trend chart */}
        <div className="absolute bottom-0 left-0 right-0 h-[80px] w-full opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#predGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
