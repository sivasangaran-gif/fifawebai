import React, { useState } from "react";
import { UserCheck, Zap, AlertCircle, Compass, Maximize2 } from "lucide-react";

export interface GateData {
  id: string;
  name: string;
  status: "Normal" | "Crowded" | "Critical";
  occupancy: number;
  flowRate: number;
  waitMinutes: number;
}

interface StadiumHeatmapProps {
  gates: GateData[];
}

export const StadiumHeatmap: React.FC<StadiumHeatmapProps> = ({ gates }) => {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Retrieve dynamic telemetry values for sectors
  const gateA = gates.find((g) => g.id === "gate_a") || { occupancy: 75, status: "Crowded" };
  const gateB = gates.find((g) => g.id === "gate_b") || { occupancy: 92, status: "Critical" };
  const gateC = gates.find((g) => g.id === "gate_c") || { occupancy: 95, status: "Critical" };
  const gateD = gates.find((g) => g.id === "gate_d") || { occupancy: 45, status: "Normal" };

  // Helper to color border and text based on occupancy rate
  const getBadgeStyles = (occupancy: number) => {
    if (occupancy >= 90) {
      return {
        border: "border-brand-red",
        text: "text-brand-red",
        bg: "bg-brand-red/10",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.4)]",
      };
    } else if (occupancy >= 70) {
      return {
        border: "border-brand-orange",
        text: "text-brand-orange",
        bg: "bg-brand-orange/10",
        glow: "shadow-[0_0_12px_rgba(249,115,22,0.4)]",
      };
    } else {
      return {
        border: "border-brand-green",
        text: "text-brand-green",
        bg: "bg-brand-green/10",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      };
    }
  };

  const styleA = getBadgeStyles(gateA.occupancy);
  const styleB = getBadgeStyles(gateB.occupancy);
  const styleC = getBadgeStyles(gateC.occupancy);
  const styleD = getBadgeStyles(gateD.occupancy);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 3D Stadium Heatmap Panel */}
      <div className="xl:col-span-2 glass-panel rounded-2xl p-5 flex flex-col justify-between scanner-container">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold tracking-tight text-white uppercase">Live Stadium Map</h3>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping"></span>
                <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider">Real-time</span>
              </span>
            </div>
            
            {/* 3D / 2D Toggles */}
            <div className="flex items-center space-x-2.5">
              <div className="flex bg-gray-950/80 border border-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("3d")}
                  className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded transition-all cursor-pointer ${
                    viewMode === "3d"
                      ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/35 font-semibold"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setViewMode("2d")}
                  className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded transition-all cursor-pointer ${
                    viewMode === "2d"
                      ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/35 font-semibold"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  2D Map
                </button>
              </div>
              
              <button className="p-1 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg transition-all" title="Full Screen">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Heatmap 3D Render Image Container */}
        <div className="relative w-full aspect-[5/3] overflow-hidden rounded-xl border border-gray-900 bg-black flex items-center justify-center select-none">
          <img
            src="/stadium_heatmap.jpg"
            alt="FIFA 2026 Stadium Heatmap Reference"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Compass overlay */}
          <div className="absolute top-[8%] left-[48.5%] transform -translate-x-1/2 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-brand-dark/95 border border-brand-cyan/40 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              <Compass className="w-4 h-4 text-brand-cyan animate-spin-slow" />
            </div>
          </div>

          {/* GATE N (North) */}
          <div className="absolute top-[18%] left-[48.5%] transform -translate-x-1/2">
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md border border-brand-green/35 bg-brand-dark/85 text-white text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
              <span>GATE N</span>
            </span>
          </div>

          {/* SECTOR A (NORTH) */}
          <div
            className={`absolute top-[25%] left-[48.5%] transform -translate-x-1/2 transition-all duration-300 ${
              hoveredBadge === "gate_a" ? "scale-105" : ""
            }`}
            onMouseEnter={() => setHoveredBadge("gate_a")}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div className={`flex flex-col items-center px-3 py-1 rounded-lg border bg-brand-dark/90 text-center ${styleA.border} ${styleA.glow}`}>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-0.5">Sector A (North)</span>
              <span className={`text-[11px] font-black tracking-tight ${styleA.text}`}>{gateA.occupancy}%</span>
            </div>
          </div>

          {/* GATE E (East) */}
          <div className="absolute top-[44%] left-[76.5%] transform -translate-x-1/2">
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md border border-brand-green/35 bg-brand-dark/85 text-white text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
              <span>GATE E</span>
            </span>
          </div>

          {/* SECTOR B (EAST) */}
          <div
            className={`absolute top-[37%] left-[67.5%] transform -translate-x-1/2 transition-all duration-300 ${
              hoveredBadge === "gate_b" ? "scale-105" : ""
            }`}
            onMouseEnter={() => setHoveredBadge("gate_b")}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div className={`flex flex-col items-center px-3 py-1 rounded-lg border bg-brand-dark/90 text-center ${styleB.border} ${styleB.glow}`}>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-0.5">Sector B (East)</span>
              <span className={`text-[11px] font-black tracking-tight ${styleB.text}`}>{gateB.occupancy}%</span>
            </div>
          </div>

          {/* GATE S (South) */}
          <div className="absolute top-[71%] left-[48.5%] transform -translate-x-1/2">
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md border border-brand-green/35 bg-brand-dark/85 text-white text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
              <span>GATE S</span>
            </span>
          </div>

          {/* SECTOR C (SOUTH) */}
          <div
            className={`absolute top-[58%] left-[48.5%] transform -translate-x-1/2 transition-all duration-300 ${
              hoveredBadge === "gate_c" ? "scale-105" : ""
            }`}
            onMouseEnter={() => setHoveredBadge("gate_c")}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div className={`flex flex-col items-center px-3 py-1 rounded-lg border bg-brand-dark/90 text-center ${styleC.border} ${styleC.glow} ${gateC.occupancy >= 90 ? "animate-pulse" : ""}`}>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-0.5">Sector C (South)</span>
              <span className={`text-[11px] font-black tracking-tight ${styleC.text}`}>{gateC.occupancy}%</span>
            </div>
          </div>

          {/* GATE W (West) */}
          <div className="absolute top-[44%] left-[20%] transform -translate-x-1/2">
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md border border-brand-green/35 bg-brand-dark/85 text-white text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
              <span>GATE W</span>
            </span>
          </div>

          {/* SECTOR D (WEST) */}
          <div
            className={`absolute top-[37%] left-[29%] transform -translate-x-1/2 transition-all duration-300 ${
              hoveredBadge === "gate_d" ? "scale-105" : ""
            }`}
            onMouseEnter={() => setHoveredBadge("gate_d")}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div className={`flex flex-col items-center px-3 py-1 rounded-lg border bg-brand-dark/90 text-center ${styleD.border} ${styleD.glow}`}>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-0.5">Sector D (West)</span>
              <span className={`text-[11px] font-black tracking-tight ${styleD.text}`}>{gateD.occupancy}%</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500 border-t border-gray-800/80 pt-4 flex justify-between items-center mt-3">
          <span>* Heatmap displays crowd density overlays on the 3D stadium layout projection.</span>
          <span className="text-brand-cyan uppercase tracking-widest font-bold">3D Render Mode Active</span>
        </div>
      </div>

      {/* Gate Cards Panel */}
      <div className="flex flex-col space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Access Point Metrics</h4>
        
        {gates.map((gate) => {
          const isHovered = hoveredBadge === gate.id;
          let gateColor = "border-brand-green";
          let badgeColor = "text-brand-green border-brand-green bg-brand-green/10";
          if (gate.occupancy >= 90) {
            gateColor = "border-brand-red";
            badgeColor = "text-brand-red border-brand-red bg-brand-red/10";
          } else if (gate.occupancy >= 70) {
            gateColor = "border-brand-orange";
            badgeColor = "text-brand-orange border-brand-orange bg-brand-orange/10";
          }

          return (
            <div
              key={gate.id}
              className={`glass-panel rounded-xl p-4 transition-all duration-300 border-l-4 ${gateColor} ${
                isHovered ? "bg-gray-800/50 scale-[1.02] border-r border-r-white/10" : ""
              }`}
              onMouseEnter={() => setHoveredBadge(gate.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold text-white block">{gate.name}</span>
                  <span className="text-[10px] text-gray-400">Main Entry Access Portal</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
                  {gate.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-gray-800/40">
                <div className="text-center">
                  <div className="text-xs text-gray-400 flex items-center justify-center space-x-1 mb-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-gray-500" />
                    <span>Density</span>
                  </div>
                  <div className="text-sm font-bold text-white">{gate.occupancy}%</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-400 flex items-center justify-center space-x-1 mb-0.5">
                    <Zap className="w-3.5 h-3.5 text-gray-500" />
                    <span>Flow Rate</span>
                  </div>
                  <div className="text-sm font-bold text-white">{gate.flowRate}/min</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-400 flex items-center justify-center space-x-1 mb-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span>Wait Time</span>
                  </div>
                  <div className="text-sm font-bold text-white">{gate.waitMinutes}m</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
