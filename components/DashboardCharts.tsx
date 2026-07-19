"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface TelemetryData {
  density: number;
  power: number;
  water: number;
  waste: number;
}

interface DashboardChartsProps {
  telemetry: TelemetryData;
}

export default function DashboardCharts({ telemetry }: DashboardChartsProps) {
  const [history, setHistory] = useState<{
    labels: string[];
    density: number[];
    power: number[];
    water: number[];
    waste: number[];
  }>({
    labels: ["20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45"],
    density: [72, 75, 78, 80, 84, 85, 87],
    power: [1.2, 1.25, 1.3, 1.28, 1.35, 1.38, 1.42],
    water: [19.2, 18.9, 18.5, 18.7, 18.3, 18.8, 18.6],
    waste: [50, 52, 58, 60, 64, 65, 68]
  });

  // Track changes to localized telemetry and update the last element of the arrays
  useEffect(() => {
    setHistory(prev => {
      const d = [...prev.density];
      const p = [...prev.power];
      const wt = [...prev.water];
      const ws = [...prev.waste];

      d[d.length - 1] = telemetry.density;
      p[p.length - 1] = telemetry.power;
      wt[wt.length - 1] = telemetry.water;
      ws[ws.length - 1] = telemetry.waste;

      return {
        ...prev,
        density: d,
        power: p,
        water: wt,
        waste: ws
      };
    });
  }, [telemetry]);

  // Live timer tick to slide the charts
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const labels = [...prev.labels];
        const density = [...prev.density];
        const power = [...prev.power];
        const water = [...prev.water];
        const waste = [...prev.waste];

        // Increment timestamp by 1 min
        const lastLabel = labels[labels.length - 1];
        const parts = lastLabel.split(":");
        let mm = parseInt(parts[1]) + 1;
        let hh = parseInt(parts[0]);
        if (mm >= 60) {
          mm = 0;
          hh = (hh + 1) % 24;
        }
        const newLabel = `${hh < 10 ? "0" + hh : hh}:${mm < 10 ? "0" + mm : mm}`;

        labels.shift();
        labels.push(newLabel);

        // Fluctuate stats
        const fluctuate = (val: number, range: number) => 
          +(val + (Math.random() - 0.5) * range).toFixed(1);

        density.shift();
        density.push(Math.max(10, Math.min(100, fluctuate(telemetry.density, 3))));

        power.shift();
        power.push(Math.max(0.1, Math.min(3.0, fluctuate(telemetry.power, 0.1))));

        water.shift();
        water.push(Math.max(1.0, Math.min(40.0, fluctuate(telemetry.water, 0.8))));

        waste.shift();
        waste.push(Math.max(5, Math.min(100, fluctuate(telemetry.waste, 2))));

        return { labels, density, power, water, waste };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [telemetry]);

  // Configuration helper
  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#101B45",
        titleColor: "#FFFFFF",
        bodyColor: "#A5B4FC",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 8,
        titleFont: { size: 9, weight: "bold" as const },
        bodyFont: { size: 10 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.3)", font: { size: 8 } }
      },
      y: {
        display: false,
        grid: { display: false }
      }
    }
  });

  const getChartData = (label: string, data: number[], color: string, stepped = false) => {
    return {
      labels: history.labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          borderWidth: 2,
          fill: true,
          stepped: stepped,
          tension: stepped ? 0 : 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: "#FFFFFF",
          pointHoverBorderWidth: 2,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 110);
            gradient.addColorStop(0, `${color}40`);
            gradient.addColorStop(1, `${color}00`);
            return gradient;
          }
        }
      ]
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {/* Chart 1: Crowd Density */}
      <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-red/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Crowd Density</span>
          <span className="px-1.5 py-0.5 rounded bg-neon-red/10 text-neon-red text-[8px] font-bold uppercase tracking-wider border border-neon-red/20">
            Very High
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-xl font-bold font-poppins text-white">{Math.round(telemetry.density)}%</h3>
          <span className="text-[9px] font-bold text-neon-red">+18% vs last hr</span>
        </div>
        <div className="h-28 mt-2 w-full">
          <Line options={getChartOptions()} data={getChartData("Density", history.density, "#FF5252")} />
        </div>
      </div>

      {/* Chart 2: Power Draw */}
      <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Power Draw</span>
          <span className="px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green text-[8px] font-bold uppercase tracking-wider border border-neon-green/20">
            Normal
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-xl font-bold font-poppins text-white">{telemetry.power} MW</h3>
          <span className="text-[9px] font-bold text-neon-green">+5.6% vs last hr</span>
        </div>
        <div className="h-28 mt-2 w-full">
          <Line options={getChartOptions()} data={getChartData("Power", history.power, "#00E676")} />
        </div>
      </div>

      {/* Chart 3: Water Flow */}
      <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Water Flow</span>
          <span className="px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green text-[8px] font-bold uppercase tracking-wider border border-neon-green/20">
            Normal
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-xl font-bold font-poppins text-white">{telemetry.water} KL/min</h3>
          <span className="text-[9px] font-bold text-neon-cyan">-2.1% vs last hr</span>
        </div>
        <div className="h-28 mt-2 w-full">
          <Line options={getChartOptions()} data={getChartData("Water", history.water, "#00C8FF")} />
        </div>
      </div>

      {/* Chart 4: Waste Capacity */}
      <div className="rounded-2xl bg-navy-card/30 border border-navy-border p-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-yellow/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Waste Capacity</span>
          <span className="px-1.5 py-0.5 rounded bg-neon-yellow/10 text-neon-yellow text-[8px] font-bold uppercase tracking-wider border border-neon-yellow/20">
            Medium
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-xl font-bold font-poppins text-white">{Math.round(telemetry.waste)}%</h3>
          <span className="text-[9px] font-bold text-neon-yellow">+8.3% vs last hr</span>
        </div>
        <div className="h-28 mt-2 w-full">
          <Line options={getChartOptions()} data={getChartData("Waste", history.waste, "#FFC107", true)} />
        </div>
      </div>
    </div>
  );
}
