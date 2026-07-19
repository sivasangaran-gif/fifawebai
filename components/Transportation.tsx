"use client";

import React from "react";
import { Train, Bus, ParkingCircle, Car } from "lucide-react";

interface TransportationProps {
  onToast: (msg: string) => void;
}

export default function Transportation({ onToast }: TransportationProps) {
  const transits = [
    { name: "Metro Service", detail: "Lines A, B & C", icon: Train, badge: "On Time", type: "green" },
    { name: "Shuttle Buses", detail: "12 Active Vehicles", icon: Bus, badge: "Good", type: "green" },
    { name: "Parking Zones", detail: "Zones 1 - 5", icon: ParkingCircle, badge: "78% Full", type: "yellow" },
    { name: "Taxi / Ride Share", detail: "External pickup points", icon: Car, badge: "High Demand", type: "red" }
  ];

  return (
    <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-5 backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Transportation Tracker</h3>
            <span className="text-[9px] text-gray-400">Live Transit Status</span>
          </div>
          <button 
            onClick={() => onToast("Loading transit maps...")} 
            className="text-[9px] font-semibold text-neon-cyan hover:underline uppercase"
          >
            View Map
          </button>
        </div>

        <div className="space-y-2.5">
          {transits.map((item, idx) => {
            const Icon = item.icon;
            const isGreen = item.type === "green";
            const isYellow = item.type === "yellow";
            
            const badgeColor = isGreen
              ? "bg-neon-green/10 text-neon-green border-neon-green/20"
              : isYellow
              ? "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20"
              : "bg-neon-red/10 text-neon-red border-neon-red/20";

            return (
              <div key={idx} className="flex items-center justify-between p-2 bg-navy-dark/40 border border-navy-border rounded-xl">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-[9px] text-gray-400">{item.detail}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-semibold ${badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
