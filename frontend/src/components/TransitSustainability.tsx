import React from "react";
import { Train, Bus, ParkingSquare, Car, CheckCircle } from "lucide-react";

export const TransitSustainability: React.FC = () => {
  // Mock Transportation Tracker Data
  const transitList = [
    {
      name: "Metro Transit Link",
      type: "Metro",
      icon: Train,
      status: "Optimal",
      statusColor: "text-brand-green border-brand-green/35 bg-brand-green/5",
      detail: "2-min headway • High throughput",
    },
    {
      name: "Shuttle Bus Route 4",
      type: "Shuttle",
      icon: Bus,
      status: "Delay (10m)",
      statusColor: "text-brand-orange border-brand-orange/35 bg-brand-orange/5",
      detail: "Traffic bottleneck at Sector B",
    },
    {
      name: "North Parking (Zone A)",
      type: "Parking",
      icon: ParkingSquare,
      status: "84% Occupied",
      statusColor: "text-brand-cyan border-brand-cyan/35 bg-brand-cyan/5",
      detail: "340 spaces remaining",
    },
    {
      name: "Taxi & Rideshare Hub",
      type: "Ride",
      icon: Car,
      status: "Operational",
      statusColor: "text-brand-green border-brand-green/35 bg-brand-green/5",
      detail: "18 cabs in queue • Fast dispatch",
    },
  ];

  // Mock Sustainability circular progress details
  const sustainabilityGauges = [
    {
      label: "Power Usage",
      value: 595,
      unit: "kW",
      pct: 74,
      color: "stroke-brand-purple",
      glowColor: "rgba(217, 70, 239, 0.4)",
    },
    {
      label: "Water Usage",
      value: 375,
      unit: "L/s",
      pct: 62,
      color: "stroke-brand-cyan",
      glowColor: "rgba(6, 182, 212, 0.4)",
    },
    {
      label: "Waste Recycled",
      value: 82,
      unit: "%",
      pct: 82,
      color: "stroke-brand-green",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
  ];

  // Mock Accessibility Services
  const accessibilityList = [
    { name: "Wheelchair Assist", desc: "18 volunteer units active", status: "Ready" },
    { name: "Audio Guidance", desc: "Ch. 4 & 5 live broadcast", status: "Active" },
    { name: "Sign Language Feed", desc: "Main screens overhead", status: "Live" },
    { name: "Live Subtitle Captions", desc: "Web app stream online", status: "Active" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Transportation Tracker */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Transportation Tracker</h3>
          <p className="text-xs text-gray-400 mb-4">Stadium arrivals & public transit telemetry</p>
          
          <div className="space-y-3.5">
            {transitList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 transition-all hover:bg-gray-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-200 block">{item.name}</span>
                      <span className="text-[10px] text-gray-500">{item.detail}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-[10px] text-gray-500 pt-4 border-t border-gray-800/50 mt-4">
          Updates feed every 30s • Transit dispatch synced
        </div>
      </div>

      {/* 2. Sustainability Overview (circular gauges) */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Sustainability Overview</h3>
          <p className="text-xs text-gray-400 mb-6">Green grid efficiency & conservation telemetry</p>
          
          <div className="grid grid-cols-3 gap-2">
            {sustainabilityGauges.map((gauge, idx) => {
              // SVG Circle properties
              const radius = 32;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (gauge.pct / 100) * circumference;

              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="stroke-gray-800/80 fill-none"
                        strokeWidth="5"
                      />
                      {/* Active Progress Circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className={`fill-none transition-all duration-1000 ease-out ${gauge.color}`}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 3px ${gauge.glowColor})` }}
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-white block leading-none">{gauge.pct}%</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-widest">{gauge.unit}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-300 block">{gauge.value} {gauge.unit}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold mt-1">
                    {gauge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-brand-green font-bold tracking-wide pt-4 border-t border-gray-800/50 mt-4">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>LEED Platinum Standard</span>
          </div>
          <span className="text-gray-500 font-normal">Grid: Eco-Stable</span>
        </div>
      </div>

      {/* 3. Accessibility Services */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Accessibility Services</h3>
          <p className="text-xs text-gray-400 mb-4">Live inclusion & support allocations</p>
          
          <div className="space-y-3.5">
            {accessibilityList.map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 transition-all hover:bg-gray-800/30">
                <div>
                  <span className="text-xs font-bold text-gray-200 block">{srv.name}</span>
                  <span className="text-[10px] text-gray-500">{srv.desc}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-[9px] font-bold uppercase tracking-wider">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-gray-500 pt-4 border-t border-gray-800/50 mt-4 flex justify-between">
          <span>Assistance desks: Gate A, C, E</span>
          <span className="text-brand-purple font-semibold hover:underline cursor-pointer">Request Escort</span>
        </div>
      </div>
    </div>
  );
};
