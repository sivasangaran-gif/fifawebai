"use client";

import React from "react";

interface SustainabilityProps {
  onToast: (msg: string) => void;
  telemetry: {
    power: number;
    water: number;
    waste: number;
  };
}

export default function Sustainability({ onToast, telemetry }: SustainabilityProps) {
  // Circular stats
  const stats = [
    { name: "Power Use", raw: `${telemetry.power} MWh`, pct: 76, color: "#00E676", strokeDash: 175, offset: 42 },
    { name: "Water Use", raw: `${telemetry.water} KL`, pct: 63, color: "#00C8FF", strokeDash: 175, offset: 64 },
    { name: "Recycled", raw: "2.8 Tons", pct: 82, color: "#7B61FF", strokeDash: 175, offset: 31 }
  ];

  return (
    <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-5 backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Sustainability Overview</h3>
            <span className="text-[9px] text-gray-400">Today's ecological impact</span>
          </div>
          <button 
            onClick={() => onToast("Loading full report...")} 
            className="text-[9px] font-semibold text-neon-cyan hover:underline uppercase"
          >
            View Report
          </button>
        </div>

        {/* Circular Progress Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={item.color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={item.strokeDash}
                    strokeDashoffset={item.offset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-[10px] font-bold">{item.pct}%</div>
              </div>
              <p className="text-[10px] font-semibold text-white mt-2">{item.name}</p>
              <span className="text-[8px] text-gray-400">{item.raw}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
