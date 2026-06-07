"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Heart,
  TrendingUp,
  BrainCircuit,
  Search,
  CheckCircle,
  Plus
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function DashboardHome() {
  const { predictions } = useApp();

  // Dynamic statistics calculations
  const totalPreds = predictions.length;
  const highRisk = predictions.filter((p) => p.result.isHighRisk).length;
  const lowRisk = predictions.filter((p) => !p.result.isHighRisk).length;
  const highRiskRatio = totalPreds > 0 ? Math.round((highRisk / totalPreds) * 100) : 0;

  // Chart data preps: Risk ratios
  const pieData = [
    { name: "Optimal Health", value: lowRisk, color: "#10b981" },
    { name: "Cardiac Risk", value: highRisk, color: "#f43f5e" }
  ];

  // Chart data preps: Chronological logs
  const areaData = [...predictions]
    .reverse()
    .slice(-8) // Take last 8 predictions
    .map((p, idx) => ({
      name: `Pt-${idx + 1}`,
      risk: Math.round(p.result.probability * 100),
      bps: p.input.trestbps,
      chol: p.input.chol
    }));

  const stats = [
    {
      label: "Total Telemetry runs",
      value: totalPreds,
      icon: BrainCircuit,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      description: "Secure locally-run classifications"
    },
    {
      label: "Critical Risk cases",
      value: highRisk,
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20",
      description: `${highRiskRatio}% of aggregate patient logs`
    },
    {
      label: "Optimal Cardiac logs",
      value: lowRisk,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      description: `${100 - highRiskRatio}% low-risk profiles`
    },
    {
      label: "LR Engine Accuracy",
      value: "81.46%",
      icon: TrendingUp,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      description: "Validated against Cleveland sets"
    }
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* 1. Header greeting bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Diagnostics Hub
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Realtime Machine Learning Cardiovascular Risk Classification Node
          </p>
        </div>

        <Link href="/dashboard/predict">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4.5 w-4.5" />}
            className="font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            New Prediction Run
          </Button>
        </Link>
      </div>

      {/* 2. Quick stats overview grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              variant="glass"
              hoverable
              animate
              delay={idx * 0.1}
              className="p-5 border-slate-200/60 dark:border-slate-900"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    {stat.label}
                  </span>
                  <h3 className="text-2xl font-black mt-2 text-slate-900 dark:text-white tabular-nums leading-none">
                    {stat.value}
                  </h3>
                </div>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium mt-3">
                {stat.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Curve Area chart (2/3 width) */}
        <Card
          variant="glass"
          animate
          delay={0.4}
          className="lg:col-span-2 p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Telemetry Risk Trends
              </h4>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                Probability index percentage across recent diagnostic sequences
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Risk Index
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {predictions.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-900/5 dark:bg-slate-950/20">
                <span className="text-xs font-bold uppercase tracking-wider animate-pulse">
                  No predictions saved. Run a classification first.
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#riskGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Risk Distribution Pie chart (1/3 width) */}
        <Card
          variant="glass"
          animate
          delay={0.5}
          className="p-5 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Cardiac Classifications
            </h4>
            <span className="text-[10px] text-slate-500 font-medium block">
              Aggregate breakdown of risk statuses
            </span>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            {predictions.length === 0 ? (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                Offline
              </span>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
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
                {/* Center text details */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-950 dark:text-white tabular-nums">
                    {totalPreds}
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Patients
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Pie Chart Legend stats list */}
          <div className="flex flex-col gap-2.5 border-t border-slate-100 dark:border-slate-900 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  Optimal Health
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                {lowRisk} ({totalPreds > 0 ? Math.round((lowRisk / totalPreds) * 100) : 0}%)
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
                {highRisk} ({totalPreds > 0 ? Math.round((highRisk / totalPreds) * 100) : 0}%)
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Recent activity history quick-list */}
      <Card
        variant="glass"
        animate
        delay={0.6}
        className="p-5 border-slate-200/60 dark:border-slate-900"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Diagnostic Sessions
            </h4>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Recent cardiological biometrics evaluations performed
            </span>
          </div>
          <Link
            href="/dashboard/history"
            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 uppercase tracking-widest"
          >
            Review Logs
          </Link>
        </div>

        {predictions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider">
              No recent biometrics recorded.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-3">
                  <th className="pb-3 font-extrabold">Time</th>
                  <th className="pb-3 font-extrabold">Biometrics (Age/Sex)</th>
                  <th className="pb-3 font-extrabold">ECG Status</th>
                  <th className="pb-3 font-extrabold">Cholesterol</th>
                  <th className="pb-3 font-extrabold">Classification Index</th>
                  <th className="pb-3 font-extrabold">Risk Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                {predictions.slice(0, 3).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="py-3.5 text-slate-500 tabular-nums">{p.timestamp}</td>
                    <td className="py-3.5 font-bold">
                      {p.input.age} yrs / {p.input.sex === 1 ? "M" : "F"}
                    </td>
                    <td className="py-3.5 text-slate-400 uppercase tracking-wide text-[10px] font-bold">
                      {["Normal", "ST-T Anom", "LVH"][p.input.restecg]}
                    </td>
                    <td className="py-3.5 tabular-nums text-slate-400">{p.input.chol} mg/dl</td>
                    <td className="py-3.5 tabular-nums font-bold text-indigo-500 dark:text-indigo-400">
                      {Math.round(p.result.probability * 100)}%
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                          ${
                            p.result.isHighRisk
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/25 animate-pulse"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                          }`}
                      >
                        {p.result.isHighRisk ? "Cardiac Risk" : "Optimal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
