"use client";

import React, { useEffect, useState } from "react";
import { Play, Users, Activity, AlertOctagon, CloudSun, Clock, Sun, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  attendance: number;
  occupancy: number;
  alertCount: number;
}

export default function StatsCards({ attendance, occupancy, alertCount }: StatsCardsProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hh = now.getHours();
      let mm = now.getMinutes();
      let ss = now.getSeconds();
      const format = (v: number) => (v < 10 ? "0" + v : v);
      setTime(`${format(hh)}:${format(mm)}:${format(ss)}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* Card 1: Match Status */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Match Status</span>
          <h3 className="text-lg font-bold font-poppins">Live Match</h3>
          <span className="text-[9px] font-semibold text-neon-green flex items-center mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block mr-1.5 animate-pulse"></span>
            Matchday 12
          </span>
        </div>
        <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-xl text-neon-green">
          <Play className="w-4 h-4 fill-neon-green" />
        </div>
      </div>

      {/* Card 2: Attendance */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Attendance</span>
          <h3 className="text-lg font-bold font-poppins">
            {attendance.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ 80k</span>
          </h3>
          <div className="w-24 bg-navy-dark h-1 rounded-full mt-2 overflow-hidden border border-navy-border">
            <div
              className="bg-neon-cyan h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancy}%` }}
            ></div>
          </div>
        </div>
        <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl text-neon-cyan">
          <Users className="w-4 h-4" />
        </div>
      </div>

      {/* Card 3: Occupancy Rate */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Occupancy Rate</span>
          <h3 className="text-lg font-bold font-poppins">{occupancy}%</h3>
          <span className="text-[9px] font-semibold text-neon-green flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +1.8% vs last hour
          </span>
        </div>
        <div className="p-3 bg-neon-purple/10 border border-neon-purple/20 rounded-xl text-neon-purple">
          <Activity className="w-4 h-4" />
        </div>
      </div>

      {/* Card 4: Active Alerts */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Active Alerts</span>
          <h3 className="text-lg font-bold font-poppins text-neon-red">{alertCount} Alerts</h3>
          <span className="text-[9px] font-semibold text-gray-400 block mt-1">3 High Priority</span>
        </div>
        <div className="p-3 bg-neon-red/10 border border-neon-red/20 rounded-xl text-neon-red">
          <AlertOctagon className="w-4 h-4" />
        </div>
      </div>

      {/* Card 5: Weather */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Weather</span>
          <h3 className="text-lg font-bold font-poppins">24°C</h3>
          <span className="text-[9px] font-semibold text-gray-400 flex items-center mt-1">
            <Sun className="w-3 h-3 text-neon-yellow mr-1" />
            Clear Sky
          </span>
        </div>
        <div className="p-3 bg-neon-yellow/10 border border-neon-yellow/20 rounded-xl text-neon-yellow">
          <CloudSun className="w-4 h-4" />
        </div>
      </div>

      {/* Card 6: Local Time */}
      <div className="stat-card rounded-2xl bg-navy-card/40 border border-navy-border p-4 flex items-center justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Local Time</span>
          <h3 className="text-lg font-bold font-poppins">{time || "20:45:12"}</h3>
          <span className="text-[9px] font-semibold text-gray-400 block mt-1">EDT Timezone</span>
        </div>
        <div className="p-3 bg-navy-dark border border-navy-border rounded-xl text-gray-400">
          <Clock className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
