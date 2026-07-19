"use client";

import React from "react";
import { Accessibility as AccessIcon, Volume2, MessageSquare, Captions } from "lucide-react";

interface AccessibilityProps {
  onToast: (msg: string) => void;
}

export default function Accessibility({ onToast }: AccessibilityProps) {
  const services = [
    { name: "Wheelchair Assistance", count: "12 Avail", icon: AccessIcon },
    { name: "Audio Guidance Channel", count: "8 Active", icon: Volume2 },
    { name: "Sign Language Interpreter", count: "4 Staff", icon: MessageSquare },
    { name: "Live Jumbotron Captions", count: "Active", icon: Captions }
  ];

  return (
    <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-5 backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Accessibility Services</h3>
            <span className="text-[9px] text-gray-400">Inclusive Experience</span>
          </div>
          <button 
            onClick={() => onToast("Loading accessibility module...")} 
            className="text-[9px] font-semibold text-neon-cyan hover:underline uppercase"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-between text-xs p-1.5 hover:bg-navy-card/40 rounded-lg transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
