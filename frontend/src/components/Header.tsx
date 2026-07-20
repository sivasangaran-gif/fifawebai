import React from "react";
import { Bot, Moon, AlertOctagon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface HeaderProps {
  attendance: number;
  occupancyRate: number;
  avgWaitTime: number;
  activeAlerts: number;
  weather: string;
  time: string;
}

export const Header: React.FC<HeaderProps> = ({
  attendance,
  occupancyRate,
  avgWaitTime,
  activeAlerts,
  weather,
  time,
}) => {
  // Mock sparkline data for KPIs
  const attendanceHistory = [
    { val: 75000 }, { val: 76500 }, { val: 77200 }, { val: 77900 }, { val: attendance }
  ];

  const waitTimeHistory = [
    { val: 18 }, { val: 16 }, { val: 15 }, { val: 13 }, { val: avgWaitTime }
  ];

  // Circular gauge calculations
  const radius = 9;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (occupancyRate / 100) * circumference;

  return (
    <header className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center bg-gray-950/80 border-b border-gray-900 px-6 py-3 select-none backdrop-blur-md">
      {/* Brand area */}
      <div className="xl:col-span-3 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white border border-brand-cyan/25 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide uppercase leading-tight font-space flex items-center">
            <span>StadiumGPT AI</span>
          </h1>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">
            Intelligent Stadium Operations
          </span>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="xl:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Total Attendance */}
        <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 rounded-xl p-2.5 h-[50px]">
          <div>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block leading-none mb-1">Total Attendance</span>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">{attendance.toLocaleString()}</span>
          </div>
          <div className="w-12 h-6 opacity-85">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceHistory}>
                <Area type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 rounded-xl p-2.5 h-[50px]">
          <div>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block leading-none mb-1">Occupancy Rate</span>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">{occupancyRate}%</span>
          </div>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg height="32" width="32" className="transform -rotate-90">
              <circle
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="16"
                cy="16"
              />
              <circle
                stroke="#10b981"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="16"
                cy="16"
              />
            </svg>
          </div>
        </div>

        {/* Avg. Wait Time */}
        <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 rounded-xl p-2.5 h-[50px]">
          <div>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block leading-none mb-1">Avg. Wait Time</span>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">{avgWaitTime} min</span>
          </div>
          <div className="w-12 h-6 opacity-85">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waitTimeHistory}>
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 rounded-xl p-2.5 h-[50px] relative overflow-hidden">
          <div>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block leading-none mb-1">Active Alerts</span>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">{activeAlerts}</span>
          </div>
          <div className="p-1 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red animate-pulse flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Right side weather + clock */}
      <div className="xl:col-span-2 flex items-center justify-end space-x-4 border-l border-gray-900 pl-4 h-[50px]">
        {/* Clock */}
        <div className="text-right">
          <span className="text-sm font-black text-white tracking-tight block leading-none mb-0.5">{time}</span>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">May 20, 2026</span>
        </div>

        {/* Weather */}
        <div className="flex items-center space-x-2 text-right">
          <div className="text-right">
            <span className="text-xs font-bold text-white block leading-none mb-0.5">{weather}</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Clear</span>
          </div>
          <Moon className="w-4 h-4 text-brand-purple glow-text-purple" />
        </div>
      </div>
    </header>
  );
};
