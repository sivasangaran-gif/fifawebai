"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize, Sliders } from "lucide-react";

interface StadiumHeatmapProps {
  onSelectGate: (gateName: string) => void;
  selectedGate: string | null;
  onToast: (msg: string) => void;
}

export default function StadiumHeatmap({ onSelectGate, selectedGate, onToast }: StadiumHeatmapProps) {
  const [zoom, setZoom] = useState(1.0);

  const handleZoom = (amount: number) => {
    setZoom(prev => Math.min(2.5, Math.max(0.6, prev * amount)));
  };

  const handleFullscreen = () => {
    const el = document.getElementById("stadium-view-container");
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
        onToast("Fullscreen mode not supported by this browser.");
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-5 relative overflow-hidden backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-glow via-transparent to-transparent pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Live Stadium Heatmap</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Real-time crowd density sectors (Click gates to inspect)</p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[9px] font-semibold">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-cyan mr-1.5 shadow-sm shadow-neon-cyan/50"></span> Low
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-green mr-1.5 shadow-sm shadow-neon-green/50"></span> Medium
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-yellow mr-1.5 shadow-sm shadow-neon-yellow/50"></span> High
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-red mr-1.5 shadow-sm shadow-neon-red/50 animate-pulse"></span> Critical
          </span>
        </div>

        {/* Controls buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => handleZoom(1.1)}
            className="p-1.5 bg-navy-dark/80 hover:bg-navy-dark border border-navy-border rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(0.9)}
            className="p-1.5 bg-navy-dark/80 hover:bg-navy-dark border border-navy-border rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-1.5 bg-navy-dark/80 hover:bg-navy-dark border border-navy-border rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToast("Loading custom telemetry settings...")}
            className="p-1.5 bg-navy-dark/80 hover:bg-navy-dark border border-navy-border rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Configure"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stadium Visual Container */}
      <div
        id="stadium-view-container"
        className="relative bg-navy-dark/50 border border-navy-border rounded-xl h-[340px] flex items-center justify-center overflow-hidden transition-all duration-300"
      >
        {/* Interactive SVG Stadium */}
        <svg
          id="stadium-svg"
          className="w-[85%] h-[85%] transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoom})` }}
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Holographic grid layers */}
          <circle cx="400" cy="250" r="230" stroke="rgba(0, 200, 255, 0.08)" strokeWidth="1" strokeDasharray="4,6" />
          <circle cx="400" cy="250" r="170" stroke="rgba(0, 200, 255, 0.08)" strokeWidth="1" strokeDasharray="4,6" />
          <circle cx="400" cy="250" r="110" stroke="rgba(0, 200, 255, 0.08)" strokeWidth="1" strokeDasharray="4,6" />
          <line x1="170" y1="250" x2="630" y2="250" stroke="rgba(0, 200, 255, 0.05)" strokeWidth="1" stroke-dasharray="2,4" />
          <line x1="400" y1="20" x2="400" y2="480" stroke="rgba(0, 200, 255, 0.05)" stroke-width="1" stroke-dasharray="2,4" />

          {/* Holographic pitch */}
          <rect x="315" y="195" width="170" height="110" rx="6" fill="#030E26" stroke="#00C8FF" stroke-width="1.5" strokeOpacity="0.3" />
          <rect x="320" y="200" width="160" height="100" rx="4" fill="rgba(0, 230, 118, 0.05)" stroke="rgba(0, 230, 118, 0.2)" stroke-width="1.2" />
          <circle cx="400" cy="250" r="24" stroke="rgba(0, 230, 118, 0.2)" stroke-width="1.2" fill="none" />
          <line x1="400" y1="200" x2="400" y2="300" stroke="rgba(0, 230, 118, 0.2)" stroke-width="1.2" />

          {/* outer concentric stands */}
          {/* Gate A (North) */}
          <path
            id="svg-gate-a"
            className={`stadium-sector cursor-pointer transition-all duration-300 ${selectedGate === "Gate A" ? "stadium-sector-selected" : ""}`}
            d="M 220 100 A 240 180 0 0 1 580 100 L 530 140 A 180 130 0 0 0 270 140 Z"
            fill="url(#heat-medium)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            onClick={() => onSelectGate("Gate A")}
          />

          {/* Gate D (East) */}
          <path
            id="svg-gate-d"
            className={`stadium-sector cursor-pointer transition-all duration-300 ${selectedGate === "Gate D" ? "stadium-sector-selected" : ""}`}
            d="M 590 120 A 240 180 0 0 1 670 360 L 600 320 A 180 130 0 0 0 540 160 Z"
            fill="url(#heat-very-high)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            onClick={() => onSelectGate("Gate D")}
          />

          {/* Gate E (South) */}
          <path
            id="svg-gate-e"
            className={`stadium-sector cursor-pointer transition-all duration-300 ${selectedGate === "Gate E" ? "stadium-sector-selected" : ""}`}
            d="M 580 400 A 240 180 0 0 1 220 400 L 270 360 A 180 130 0 0 0 530 360 Z"
            fill="url(#heat-medium)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            onClick={() => onSelectGate("Gate E")}
          />

          {/* Gate B (West) */}
          <path
            id="svg-gate-b"
            className={`stadium-sector cursor-pointer transition-all duration-300 ${selectedGate === "Gate B" ? "stadium-sector-selected" : ""}`}
            d="M 130 360 A 240 180 0 0 1 210 120 L 260 160 A 180 130 0 0 0 200 320 Z"
            fill="url(#heat-high)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            onClick={() => onSelectGate("Gate B")}
          />

          {/* Gate C (VIP / Inner stands) */}
          <path
            id="svg-gate-c"
            className={`stadium-sector cursor-pointer transition-all duration-300 ${selectedGate === "Gate C" ? "stadium-sector-selected" : ""}`}
            d="M 270 145 A 180 130 0 0 1 530 145 A 180 130 0 0 1 530 355 A 180 130 0 0 1 270 355 Z"
            fill="url(#heat-low)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            fillOpacity="0.85"
            onClick={() => onSelectGate("Gate C")}
          />

          {/* sector dividers */}
          <line x1="220" y1="100" x2="270" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="580" y1="100" x2="530" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="590" y1="120" x2="540" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="670" y1="360" x2="600" y2="320" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="580" y1="400" x2="530" y2="360" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="220" y1="400" x2="270" y2="360" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="130" y1="360" x2="260" y2="320" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="210" y1="120" x2="260" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* heat gradients definitions */}
          <defs>
            <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#071A3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#071A3D" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E676" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#071A3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#071A3D" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#071A3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#071A3D" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="heat-very-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF5252" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#071A3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#071A3D" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>

        {/* Floating Badges */}
        <div
          onClick={() => onSelectGate("Gate A")}
          className="absolute top-[30px] left-[150px] md:left-[220px] bg-navy-card/85 border border-neon-cyan/40 hover:border-neon-cyan px-2.5 py-1 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-all group scale-95 hover:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-sm shadow-neon-green/50"></div>
          <div className="text-[9px] font-semibold text-left">
            <p className="font-bold text-white group-hover:text-neon-cyan transition-colors">GATE A</p>
            <p className="text-[8px] text-gray-400">Medium (2.4k)</p>
          </div>
        </div>

        <div
          onClick={() => onSelectGate("Gate B")}
          className="absolute top-[170px] left-[15px] md:left-[35px] bg-navy-card/85 border border-neon-yellow/40 hover:border-neon-yellow px-2.5 py-1 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-all group scale-95 hover:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow shadow-sm shadow-neon-yellow/50"></div>
          <div className="text-[9px] font-semibold text-left">
            <p className="font-bold text-white group-hover:text-neon-yellow transition-colors">GATE B</p>
            <p className="text-[8px] text-gray-400">High (5.8k)</p>
          </div>
        </div>

        <div
          onClick={() => onSelectGate("Gate C")}
          className="absolute top-[150px] left-[320px] md:left-[380px] bg-navy-card/85 border border-neon-cyan/40 hover:border-neon-cyan px-2.5 py-1 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-all group scale-95 hover:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-sm shadow-neon-cyan/50"></div>
          <div className="text-[9px] font-semibold text-left">
            <p className="font-bold text-white group-hover:text-neon-cyan transition-colors">GATE C</p>
            <p className="text-[8px] text-gray-400">Low (1.2k)</p>
          </div>
        </div>

        <div
          onClick={() => onSelectGate("Gate D")}
          className="absolute top-[160px] right-[15px] md:right-[35px] bg-navy-card/85 border border-neon-red/40 hover:border-neon-red px-2.5 py-1 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-all group scale-95 hover:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neon-red shadow-sm shadow-neon-red/50 animate-pulse"></div>
          <div className="text-[9px] font-semibold text-left">
            <p className="font-bold text-white group-hover:text-neon-red transition-colors">GATE D</p>
            <p className="text-[8px] text-gray-400">Critical (7.1k)</p>
          </div>
        </div>

        <div
          onClick={() => onSelectGate("Gate E")}
          className="absolute bottom-[30px] right-[150px] md:right-[220px] bg-navy-card/85 border border-neon-cyan/40 hover:border-neon-cyan px-2.5 py-1 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-all group scale-95 hover:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-sm shadow-neon-green/50"></div>
          <div className="text-[9px] font-semibold text-left">
            <p className="font-bold text-white group-hover:text-neon-cyan transition-colors">GATE E</p>
            <p className="text-[8px] text-gray-400">Medium (3.2k)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
