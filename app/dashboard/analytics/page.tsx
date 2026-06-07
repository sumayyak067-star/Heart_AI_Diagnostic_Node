"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Activity, Heart, ShieldCheck, Info } from "lucide-react";

export default function AnalyticsPage() {
  const { predictions } = useApp();

  // Dynamic statistics calculations
  const total = predictions.length;
  const highRisk = predictions.filter((p) => p.result.isHighRisk).length;
  const lowRisk = predictions.filter((p) => !p.result.isHighRisk).length;

  // Chart 1: Blood Pressure & Cholesterol Trends across recent patients
  const trendData = [...predictions]
    .reverse()
    .map((p, idx) => ({
      name: `Pt-${idx + 1}`,
      BP: p.input.trestbps,
      Cholesterol: p.input.chol,
      HeartRate: p.input.thalach,
      Risk: Math.round(p.result.probability * 100)
    }));

  // Chart 2: Risk breakdowns
  const pieData = [
    { name: "Optimal Health", value: lowRisk, color: "#10b981" },
    { name: "Cardiac Risk", value: highRisk, color: "#f43f5e" }
  ];

  // Chart 3: Patient averages vs optimal levels
  const avgAge = total > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.input.age, 0) / total) : 50;
  const avgBp = total > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.input.trestbps, 0) / total) : 120;
  const avgChol = total > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.input.chol, 0) / total) : 220;
  const avgMaxHr = total > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.input.thalach, 0) / total) : 150;

  const comparisonData = [
    { name: "Blood Pres (mm Hg)", Average: avgBp, Optimal: 120 },
    { name: "Cholesterol (mg/dl)", Average: Math.round(avgChol / 2), Optimal: 100 }, // Scaled down for bar chart alignment
    { name: "Max Heart (bpm)", Average: avgMaxHr, Optimal: 160 }
  ];

  return (
    <div className="flex flex-col gap-6 text-left select-none animate-fadeIn">
      {/* 1. Header copy */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Diagnostics Analyst
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Review mathematical trends, chronological biometrics, and average heart indicators.
          {avgChol >= 240 && " Note: Average cholesterol levels are currently elevated."}
        </p>
      </div>

      {/* Empty State Fallback if zero predictions recorded */}
      {predictions.length === 0 ? (
        <Card variant="glass" className="py-16 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Activity className="h-10 w-10 text-indigo-500/40 animate-pulse mx-auto mb-4" />
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest">
            Diagnostics Node Offline
          </h3>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            There are no saved biometrics telemetry run records to compute trend distributions. Proceed to the Prediction Portal to run a classification.
          </p>
        </Card>
      ) : (
        <>
          {/* 2. Top Level Analytics: Line and Pie charts side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* BP & Cholesterol curves Line Chart */}
            <Card
              variant="glass"
              className="lg:col-span-2 p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Biometric Telemetry Curves
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                    Serum cholesterol vs resting blood pressure across chronological patient logs
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Cholesterol</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span>Blood Pressure</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.12} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="Cholesterol"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      dot={{ r: 3, stroke: "#22d3ee", strokeWidth: 1, fill: "#0f172a" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="BP"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ r: 3, stroke: "#6366f1", strokeWidth: 1, fill: "#0f172a" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Risk Classifications Pie Chart */}
            <Card
              variant="glass"
              className="p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Cardiological Distribution
                </h4>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Breakdown ratio of diagnostic classifications
                </span>
              </div>

              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={entry.value === 0 ? 0.15 : 1} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                    {total}
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Records
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-slate-100 dark:border-slate-900 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      Optimal Health
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {lowRisk} ({Math.round((lowRisk / total) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      Cardiac Risk
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {highRisk} ({Math.round((highRisk / total) * 100)}%)
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* 3. Bottom Level Analytics: Side-by-side Bar chart and Clinical Metrics Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Biometric Comparison side-by-side Bar Chart (2/3 width) */}
            <Card
              variant="glass"
              className="lg:col-span-2 p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Clinician averages vs Optimal
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                    Compares average recorded patient levels to clinical optimal cardiology baseline standards.
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    <span>Average</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span>Optimal</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.12} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="Average" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="Optimal" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2 items-start mt-4 p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-850">
                <Info className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal font-medium">
                  <strong>Standardization Note:</strong> Cholesterol values are represented on a 1:2 scale relative to other baselines for optimal graphical grid rendering. Baseline healthy levels represent AHA (American Heart Association) clinical defaults.
                </p>
              </div>
            </Card>

            {/* General Biometric averages card */}
            <Card
              variant="glass"
              className="p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Cardiological averages
                </h4>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Computed telemetry averages across saved log files
                </span>
              </div>

              <div className="flex flex-col gap-5 my-6">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Patient Average Age
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                      {avgAge} yrs
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(avgAge / 100) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Avg Blood pressure
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                      {avgBp} mm Hg
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${avgBp >= 140 ? "bg-rose-500" : "bg-cyan-400"}`}
                      style={{ width: `${(avgBp / 200) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Avg Cholesterol
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                      {avgChol} mg/dl
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${avgChol >= 240 ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${(avgChol / 400) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 self-start">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[9px] font-extrabold uppercase text-indigo-400 tracking-wider">
                  HIPAA Secured Log Node
                </span>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
