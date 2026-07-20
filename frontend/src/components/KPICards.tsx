import React from "react";
import { Activity, Users, Percent, AlertTriangle, CloudSun, Clock } from "lucide-react";

export interface KPIData {
  matchStatus: string;
  attendance: number;
  capacity: number;
  occupancyRate: number;
  activeAlerts: number;
  weather: string;
  currentTime: string;
}

interface KPICardsProps {
  kpis: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "Match Status",
      value: kpis.matchStatus,
      icon: Activity,
      borderColor: "border-brand-purple",
      textColor: "text-brand-purple glow-text-purple",
      desc: "Group Stage • Matchday 2",
    },
    {
      title: "Live Attendance",
      value: `${kpis.attendance.toLocaleString()} / ${kpis.capacity.toLocaleString()}`,
      icon: Users,
      borderColor: "border-brand-blue",
      textColor: "text-brand-blue",
      desc: "Spectators in stadium",
    },
    {
      title: "Occupancy Rate",
      value: `${kpis.occupancyRate}%`,
      icon: Percent,
      borderColor: "border-brand-cyan",
      textColor: "text-brand-cyan glow-text-cyan",
      desc: "Seating capacity fill",
    },
    {
      title: "Active Alerts",
      value: kpis.activeAlerts,
      icon: AlertTriangle,
      borderColor: kpis.activeAlerts > 0 ? "border-brand-red animate-pulse" : "border-brand-green",
      textColor: kpis.activeAlerts > 0 ? "text-brand-red glow-text-red" : "text-brand-green glow-text-green",
      desc: kpis.activeAlerts > 0 ? "Requires attention" : "Systems nominal",
    },
    {
      title: "Weather",
      value: kpis.weather,
      icon: CloudSun,
      borderColor: "border-brand-orange",
      textColor: "text-brand-orange glow-text-orange",
      desc: "Roof Open • Wind: Calm",
    },
    {
      title: "Operations Time",
      value: kpis.currentTime,
      icon: Clock,
      borderColor: "border-gray-700",
      textColor: "text-gray-300",
      desc: "GMT-5 Local Time",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel border-l-4 ${card.borderColor} rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] hover:bg-opacity-80`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {card.title}
              </span>
              <IconComponent className={`w-4 h-4 ${card.textColor.split(" ")[0]}`} />
            </div>
            <div className={`text-xl font-bold tracking-tight ${card.textColor} mb-1`}>
              {card.value}
            </div>
            <div className="text-[10px] text-gray-500">{card.desc}</div>
          </div>
        );
      })}
    </div>
  );
};
