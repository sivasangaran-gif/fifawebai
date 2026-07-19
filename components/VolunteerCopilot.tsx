"use client";

import React, { useState } from "react";
import { Sparkles, Search, ArrowRight } from "lucide-react";

interface VolunteerCopilotProps {
  onToast: (msg: string) => void;
  onChatAction: (promptText: string) => void;
}

export default function VolunteerCopilot({ onToast, onChatAction }: VolunteerCopilotProps) {
  const [search, setSearch] = useState("");

  const handlePillClick = (val: string) => {
    setSearch(val);
    onToast(`Query populated: "${val}"`);
  };

  const handleSearchSubmit = () => {
    if (!search.trim()) {
      onToast("Please enter a question or click a quick prompt pill.");
      return;
    }
    onChatAction(search);
    setSearch("");
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-indigo-950/20 to-navy-card/30 border border-navy-border p-5 backdrop-blur-md flex flex-col justify-between h-full relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/5 to-transparent pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-navy-border/40 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-neon-yellow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Volunteer AI Copilot</h3>
        </div>
        <span className="px-2 py-0.5 rounded-lg bg-neon-yellow/10 text-neon-yellow text-[9px] font-bold uppercase border border-neon-yellow/20">
          Operational Support
        </span>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {/* Premium 3D AI Robot Avatar */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan p-[1.5px] shadow-lg shadow-neon-purple/20 flex-shrink-0">
          <div className="w-full h-full bg-navy-dark rounded-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-neon-cyan/10 animate-ping rounded-full"></div>
            <svg
              className="w-9 h-9 text-neon-cyan animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">"How can I help you today? Get instant guidance."</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Quick search for staff shifts, maps and first-aid location protocols.
          </p>
        </div>
      </div>

      {/* Volunteer search/pills */}
      <div>
        <div className="relative flex items-center mb-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Type volunteer question..."
            className="w-full text-xs px-3.5 py-2.5 pl-10 bg-navy-dark border border-navy-border rounded-xl focus:border-neon-yellow/60 focus:ring-1 focus:ring-neon-yellow/20 focus:outline-none transition-all placeholder-gray-500 text-white"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
          <button
            onClick={handleSearchSubmit}
            className="absolute right-2 p-1 bg-neon-yellow hover:bg-neon-yellow/90 rounded-lg text-navy-dark font-bold"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handlePillClick("Where is the lost & found desk?")}
            className="px-2.5 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-xl text-[9px] text-gray-400 hover:text-white transition-colors"
          >
            Lost & found desk?
          </button>
          <button
            onClick={() => handlePillClick("Nearest emergency exit?")}
            className="px-2.5 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-xl text-[9px] text-gray-400 hover:text-white transition-colors"
          >
            Emergency exits?
          </button>
          <button
            onClick={() => handlePillClick("Contact Medical Team")}
            className="px-2.5 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-xl text-[9px] text-gray-400 hover:text-white transition-colors text-neon-red font-semibold"
          >
            Contact Medical
          </button>
          <button
            onClick={() => handlePillClick("Check volunteer shifts")}
            className="px-2.5 py-1 bg-navy-dark hover:bg-navy-dark/80 border border-navy-border rounded-xl text-[9px] text-gray-400 hover:text-white transition-colors"
          >
            Volunteer Shifts
          </button>
        </div>
      </div>
    </div>
  );
}
