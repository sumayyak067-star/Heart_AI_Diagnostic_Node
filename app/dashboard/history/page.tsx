"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  History,
  FileSpreadsheet,
  X
} from "lucide-react";

export default function HistoryPage() {
  const { predictions, deletePrediction, clearHistory } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "low">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Filter & Search calculations
  const filteredPredictions = predictions
    .filter((p) => {
      // Filter by risk
      if (riskFilter === "high") return p.result.isHighRisk;
      if (riskFilter === "low") return !p.result.isHighRisk;
      return true;
    })
    .filter((p) => {
      // Filter by query (searches age, cholesterol, blood pressure, gender)
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      
      const gender = p.input.sex === 1 ? "male" : "female";
      const restecg = ["normal", "st-t wave", "lvh"][p.input.restecg];
      
      return (
        p.input.age.toString().includes(q) ||
        p.input.trestbps.toString().includes(q) ||
        p.input.chol.toString().includes(q) ||
        p.input.thalach.toString().includes(q) ||
        gender.includes(q) ||
        restecg.includes(q) ||
        p.result.confidence.toString().includes(q)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to permanently clear all cardiovascular diagnostic logs? This action is HIPAA-irreversible.")) {
      clearHistory();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none animate-fadeIn relative">
      
      {/* 1. Header Copy */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Diagnostics Archives
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Browse, search, sort, and manage patient cardiovascular logs stored in local memory.
          </p>
        </div>

        {predictions.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearHistory}
            leftIcon={<Trash2 className="h-4 w-4" />}
            className="font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            Clear Archive
          </Button>
        )}
      </div>

      {predictions.length === 0 ? (
        <Card variant="glass" className="py-16 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <History className="h-10 w-10 text-indigo-500/40 animate-pulse mx-auto mb-4" />
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest">
            History Logs Empty
          </h3>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            There are zero clinical telemetry sequences saved. Create a cardiac profile in the Prediction Portal to log initial diagnostics parameters.
          </p>
        </Card>
      ) : (
        <>
          {/* 2. Interactive Search & Filtration Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Search inputs */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by age, chol, BP, gender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200"
              />
            </div>

            {/* Risk Filters select */}
            <div className="relative flex items-center">
              <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={riskFilter}
                onChange={(e: any) => setRiskFilter(e.target.value)}
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 cursor-pointer appearance-none"
              >
                <option value="all">All Diagnostic Cases</option>
                <option value="high">Critical Risk Only</option>
                <option value="low">Optimal Health Only</option>
              </select>
            </div>

            {/* Sort selectors */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 cursor-pointer appearance-none"
              >
                <option value="newest">Sort: Newest Sequence First</option>
                <option value="oldest">Sort: Oldest Sequence First</option>
              </select>
            </div>
          </div>

          {/* 3. Main Data Archives Table */}
          <Card
            variant="glass"
            className="p-0 border-slate-200/60 dark:border-slate-900 overflow-hidden"
          >
            {filteredPredictions.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">
                  No records match your query filters.
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-900 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-900/5 dark:bg-slate-950/20">
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6">Patient Biometrics</th>
                      <th className="py-4 px-6">Resting BP</th>
                      <th className="py-4 px-6">Cholesterol</th>
                      <th className="py-4 px-6">Inference Index</th>
                      <th className="py-4 px-6">Assessment</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {filteredPredictions.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedRecord(p)}
                        className="hover:bg-slate-500/5 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6 text-slate-500 tabular-nums">{p.timestamp}</td>
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                          Age {p.input.age} / {p.input.sex === 1 ? "Male" : "Female"}
                        </td>
                        <td className="py-4 px-6 tabular-nums text-slate-400">{p.input.trestbps} mm Hg</td>
                        <td className="py-4 px-6 tabular-nums text-slate-400">{p.input.chol} mg/dl</td>
                        <td className="py-4 px-6 tabular-nums font-bold text-indigo-500 dark:text-indigo-400">
                          {Math.round(p.result.probability * 100)}%
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                              ${
                                p.result.isHighRisk
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/25 animate-pulse"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                              }`}
                          >
                            {p.result.isHighRisk ? "Critical Risk" : "Optimal"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => deletePrediction(p.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* 4. Slide-Over Detail Drawer Modal */}
      {selectedRecord && (
        <>
          <div
            onClick={() => setSelectedRecord(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fadeIn"
          />
          <div className="fixed top-0 right-0 w-full max-w-lg h-full bg-slate-950 border-l border-slate-900 shadow-2xl p-6 overflow-y-auto z-50 animate-[slideIn_0.3s_ease-out]">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                  Telemetry Record Detail
                </span>
                <h3 className="text-sm font-bold text-white mt-1 uppercase tracking-wide">
                  Sequence: {selectedRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                <span className="block text-[9px] uppercase font-bold text-slate-500">Risk Score</span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">
                  {Math.round(selectedRecord.result.probability * 100)}%
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                <span className="block text-[9px] uppercase font-bold text-slate-500">Confidence</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {selectedRecord.result.confidence}%
                </span>
              </div>
            </div>

            {/* Complete 13 features table */}
            <div className="flex flex-col gap-4 mb-6">
              <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wide">
                Recorded Cardiovascular Markers
              </h4>
              
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 overflow-hidden text-xs">
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/40 border-b border-slate-900 font-bold uppercase text-[9px] tracking-wider text-slate-500">
                  <span>Biometric Marker</span>
                  <span>Value</span>
                </div>
                
                <div className="divide-y divide-slate-900/60 pl-3 pr-3 font-medium text-slate-400">
                  <div className="grid grid-cols-2 py-2">
                    <span>Age</span>
                    <span className="text-slate-200">{selectedRecord.input.age} yrs</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Sex Assigned</span>
                    <span className="text-slate-200">{selectedRecord.input.sex === 1 ? "Male" : "Female"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Chest Pain Type</span>
                    <span className="text-slate-200">
                      {["Typical Angina", "Atypical Angina", "Non-Anginal", "Asymptomatic"][selectedRecord.input.cp]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Resting Blood Pressure</span>
                    <span className="text-slate-200">{selectedRecord.input.trestbps} mm Hg</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Serum Cholesterol</span>
                    <span className="text-slate-200">{selectedRecord.input.chol} mg/dl</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Fasting Blood Sugar</span>
                    <span className="text-slate-200">{selectedRecord.input.fbs === 1 ? "> 120 mg/dl" : "<= 120 mg/dl"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Resting ECG</span>
                    <span className="text-slate-200">
                      {["Normal ECG", "ST-T wave abnormality", "Left ventricular hypertrophy"][selectedRecord.input.restecg]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Max achieved heart rate</span>
                    <span className="text-slate-200">{selectedRecord.input.thalach} bpm</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Exercise-Induced Angina</span>
                    <span className="text-slate-200">{selectedRecord.input.exang === 1 ? "Positive (Yes)" : "Negative (No)"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>ST segment depression</span>
                    <span className="text-slate-200">{selectedRecord.input.oldpeak} mm</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>ST Slope Peak</span>
                    <span className="text-slate-200">{["Upsloping", "Flat", "Downsloping"][selectedRecord.input.slope]}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Blocked Vessels CA</span>
                    <span className="text-slate-200">{selectedRecord.input.ca} major vessels</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span>Thalassemia profile</span>
                    <span className="text-slate-200">{["Null", "Normal", "Fixed Defect", "Reversible Defect"][selectedRecord.input.thal]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated diagnostic insights list */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wide">
                Calibration Assessment Insights
              </h4>
              {selectedRecord.result.insights.map((insight: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex gap-3 p-3.5 rounded-xl border leading-relaxed text-left text-xs font-medium
                    ${
                      insight.category === "warning"
                        ? "bg-rose-500/5 border-rose-500/10 text-rose-400"
                        : insight.category === "info"
                        ? "bg-cyan-500/5 border-cyan-500/10 text-cyan-400"
                        : "bg-emerald-500/5 border-emerald-500/10 text-emerald-450"
                    }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {insight.category === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    )}
                  </div>
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
