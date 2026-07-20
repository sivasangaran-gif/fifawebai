import React, { useState, useEffect } from "react";
import { LogIn, LogOut, Utensils, PersonStanding, Flame, SquareParking, Info, X, RefreshCw } from "lucide-react";

export const FacilitiesCamera: React.FC = () => {
  const [activeCam, setActiveCam] = useState<any | null>(null);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + "." + String(now.getMilliseconds()).padStart(3, '0'));
    };
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Facility categories definitions
  const facilities = [
    { name: "Entrances", icon: LogIn, border: "border-brand-green bg-brand-green/5 text-brand-green" },
    { name: "Exits", icon: LogOut, border: "border-brand-green bg-brand-green/5 text-brand-green" },
    { name: "Food Courts", icon: Utensils, border: "border-brand-blue bg-brand-blue/5 text-brand-blue" },
    { name: "Restrooms", icon: PersonStanding, border: "border-brand-purple bg-brand-purple/5 text-brand-purple" },
    { name: "Medical", icon: Flame, border: "border-brand-red bg-brand-red/5 text-brand-red" },
    { name: "Parking", icon: SquareParking, border: "border-brand-cyan bg-brand-cyan/5 text-brand-cyan" },
    { name: "Information", icon: Info, border: "border-gray-600 bg-gray-600/5 text-gray-400" },
  ];

  // Live CCTV cameras
  const cameras = [
    {
      name: "Gate N",
      imgUrl: "/cctv_gate_n.png",
    },
    {
      name: "Food Court 1",
      imgUrl: "/cctv_food_court.png",
    },
    {
      name: "Sector C Entry",
      imgUrl: "/cctv_sector_c.png",
    },
    {
      name: "Parking E",
      imgUrl: "/cctv_parking_e.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Facilities Widget */}
      <div className="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Facilities</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {facilities.map((fac, idx) => {
              const IconComp = fac.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => alert(`Showing locations for: "${fac.name}"`)}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105 ${fac.border}`}>
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider text-center mt-2 leading-tight">
                    {fac.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-[10px] text-gray-500 border-t border-gray-800/80 pt-4 mt-3">
          Click category to highlight on the main live heatmap sectors.
        </div>
      </div>

      {/* Live Camera Feeds Widget */}
      <div className="lg:col-span-7 glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Camera Feeds</h3>
            <button
              onClick={() => alert("Loading all CCTV feeds coordinates...")}
              className="text-[10px] text-brand-cyan hover:underline uppercase tracking-wider font-bold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cameras.map((cam, idx) => (
              <div
                key={idx}
                className="group relative aspect-video sm:aspect-square md:aspect-video rounded-xl border border-gray-900 bg-black overflow-hidden cursor-pointer shadow-lg"
                onClick={() => setActiveCam(cam)}
              >
                {/* Image */}
                <img
                  src={cam.imgUrl}
                  alt={`CCTV Feed ${cam.name}`}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-300"
                />

                {/* Blinking Live Indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 px-1.5 py-0.5 rounded border border-brand-red/20 text-[8px] font-bold text-brand-red uppercase">
                  <span className="w-1 h-1 rounded-full bg-brand-red animate-ping"></span>
                  <span>Live</span>
                </div>

                {/* Label Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/45 to-transparent p-2 text-left">
                  <span className="text-[10px] font-bold text-gray-200 block truncate leading-none">
                    {cam.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-gray-500 border-t border-gray-800/80 pt-4 mt-3 flex justify-between">
          <span>Feed delay: ~120ms • Encrypted stream active</span>
          <span className="text-brand-cyan hover:underline cursor-pointer uppercase font-bold text-[9px] tracking-wider">
            Re-sync feeds
          </span>
        </div>
      </div>

      {/* CCTV Monitor Feed Overlay */}
      {activeCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="glass-panel border border-brand-cyan/35 rounded-2xl max-w-2xl w-full p-6 relative overflow-hidden scanner-container shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/80 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse"></span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  CCTV MONITOR FEED: {activeCam.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCam(null)}
                className="p-1 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Feed Screen */}
            <div className="relative aspect-video rounded-xl border border-brand-cyan/20 bg-black overflow-hidden select-none">
              {/* Image */}
              <img
                src={activeCam.imgUrl}
                alt={activeCam.name}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Scanning lines filter */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent animate-scan pointer-events-none" style={{ animationDuration: '4s' }}></div>

              {/* Target Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <div className="w-8 h-8 border border-brand-cyan rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full"></div>
                </div>
                <div className="w-12 h-[1px] bg-brand-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="h-12 w-[1px] bg-brand-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {/* Overlay HUD indicators */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-brand-cyan space-y-0.5 bg-black/70 px-2 py-1 rounded border border-brand-cyan/15">
                <p>SYS.LOC: METLIFE PORTAL</p>
                <p>CAM.RES: 1080P FHD</p>
                <p>CAM.FPS: 30.00 FPS</p>
              </div>

              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-brand-cyan bg-black/70 px-2 py-1 rounded border border-brand-cyan/15 text-right">
                <p>TIME: {timeStr}</p>
                <p>STATUS: ONLINE</p>
              </div>

              {/* Blinking Live Indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-brand-red/20 border border-brand-red/35 px-2 py-0.5 rounded text-[8px] font-bold text-brand-red uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping"></span>
                <span>Recording</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-800/80">
              <button
                onClick={() => alert(`Re-syncing feed for ${activeCam.name}...`)}
                className="flex-1 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700/80 hover:text-white rounded-xl text-xs font-semibold text-gray-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-sync Stream</span>
              </button>
              <button
                onClick={() => setActiveCam(null)}
                className="flex-1 py-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Close CCTV Monitor
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
