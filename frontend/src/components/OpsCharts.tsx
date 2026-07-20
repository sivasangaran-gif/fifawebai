import React from "react";
import { ResponsiveContainer, AreaChart, Area, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Eye, ShieldAlert, Droplet, Trash2 } from "lucide-react";

export interface HistoryPoint {
  time: string;
  crowdDensity: number;
  powerDraw: number;
  waterFlow: number;
  wasteCapacity: number;
}

interface OpsChartsProps {
  history: HistoryPoint[];
}

export const OpsCharts: React.FC<OpsChartsProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className="text-gray-400">Loading charts telemetry...</div>;
  }

  const latest = history[history.length - 1];
  const previous = history.length >= 2 ? history[history.length - 2] : latest;

  const getDeltaInfo = (current: number, prev: number) => {
    const diff = current - prev;
    const isUp = diff >= 0;
    const percent = prev !== 0 ? Math.abs((diff / prev) * 100).toFixed(1) : "0.0";
    return {
      diff: Math.abs(diff).toFixed(0),
      percent,
      isUp,
      text: `${isUp ? "+" : "-"}${percent}% vs last hour`,
    };
  };

  const metrics = [
    {
      title: "Crowd Density",
      value: `${latest.crowdDensity}%`,
      icon: Eye,
      color: "#d946ef", // brand-purple
      gradientId: "crowdGrad",
      dataKey: "crowdDensity",
      delta: getDeltaInfo(latest.crowdDensity, previous.crowdDensity),
      unit: "%",
    },
    {
      title: "Power Draw",
      value: `${latest.powerDraw} kW`,
      icon: ShieldAlert,
      color: "#06b6d4", // brand-cyan
      gradientId: "powerGrad",
      dataKey: "powerDraw",
      delta: getDeltaInfo(latest.powerDraw, previous.powerDraw),
      unit: " kW",
    },
    {
      title: "Water Flow",
      value: `${latest.waterFlow} L/s`,
      icon: Droplet,
      color: "#3b82f6", // brand-blue
      gradientId: "waterGrad",
      dataKey: "waterFlow",
      delta: getDeltaInfo(latest.waterFlow, previous.waterFlow),
      unit: " L/s",
    },
    {
      title: "Waste Capacity",
      value: `${latest.wasteCapacity}%`,
      icon: Trash2,
      color: "#f97316", // brand-orange
      gradientId: "wasteGrad",
      dataKey: "wasteCapacity",
      delta: getDeltaInfo(latest.wasteCapacity, previous.wasteCapacity),
      unit: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((m, idx) => {
        const IconComponent = m.icon;
        const delta = m.delta;

        return (
          <div key={idx} className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[180px] relative overflow-hidden transition-all duration-300 hover:border-gray-700/80">
            {/* Metric Info */}
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {m.title}
                </span>
                <span className="text-2xl font-bold tracking-tight text-white">{m.value}</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                <IconComponent className="w-5 h-5" style={{ color: m.color }} />
              </div>
            </div>

            {/* Mini Recharts AreaChart */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] w-full opacity-60 hover:opacity-95 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={m.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={m.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <YAxis domain={["dataMin - 10", "dataMax + 10"]} hide />
                  <Area
                    type="monotone"
                    dataKey={m.dataKey}
                    stroke={m.color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${m.gradientId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Delta Indicator */}
            <div className="flex items-center space-x-1.5 text-[10px] font-semibold tracking-wide z-10">
              {delta.isUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-brand-red" />
              )}
              <span className={delta.isUp ? "text-brand-green" : "text-brand-red"}>
                {delta.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
