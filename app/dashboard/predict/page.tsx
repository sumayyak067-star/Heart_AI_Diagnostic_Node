"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Info,
  Sparkles,
  ClipboardList,
  Activity,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { HeartDiseaseInput } from "@/lib/lrModel";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";

// Pre-calibrated diagnostic templates
const PRESETS = {
  athlete: {
    age: 28, sex: 1, cp: 0, trestbps: 115, chol: 170, fbs: 0, restecg: 0,
    thalach: 185, exang: 0, oldpeak: 0.0, slope: 2, ca: 0, thal: 1
  },
  highRisk: {
    age: 67, sex: 1, cp: 0, trestbps: 160, chol: 286, fbs: 0, restecg: 0,
    thalach: 108, exang: 1, oldpeak: 1.5, slope: 1, ca: 3, thal: 2
  },
  standard: {
    age: 52, sex: 0, cp: 2, trestbps: 136, chol: 196, fbs: 0, restecg: 0,
    thalach: 169, exang: 0, oldpeak: 0.1, slope: 1, ca: 0, thal: 2
  }
};

export default function PredictPage() {
  const router = useRouter();
  const { addPrediction } = useApp();

  // Form State
  const [formData, setFormData] = useState<HeartDiseaseInput>({
    age: 50,
    sex: 1,
    cp: 1,
    trestbps: 120,
    chol: 220,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Auto-fill template click handler
  const handleLoadPreset = (key: keyof typeof PRESETS) => {
    setFormData(PRESETS[key]);
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      age: 50, sex: 1, cp: 1, trestbps: 120, chol: 220, fbs: 0, restecg: 0,
      thalach: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2
    });
    setErrors({});
  };

  // Generic value changers
  const handleChange = (key: keyof HeartDiseaseInput, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear specific error on edit
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Perform client-side validation
  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (formData.age < 1 || formData.age > 120) {
      nextErrors.age = "Age must be between 1 and 120 years.";
    }
    if (formData.trestbps < 50 || formData.trestbps > 250) {
      nextErrors.trestbps = "Blood pressure range: 50 - 250 mm Hg.";
    }
    if (formData.chol < 80 || formData.chol > 600) {
      nextErrors.chol = "Cholesterol range: 80 - 600 mg/dl.";
    }
    if (formData.thalach < 50 || formData.thalach > 220) {
      nextErrors.thalach = "Max heart rate range: 50 - 220 bpm.";
    }
    if (formData.oldpeak < 0 || formData.oldpeak > 10) {
      nextErrors.oldpeak = "ST Depression range: 0.0 - 10.0.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Calculate prediction, append to Context history
    const result = addPrediction(formData);

    // Save current run parameters in sessionStorage for Results Page retrieval
    sessionStorage.setItem("last_prediction_input", JSON.stringify(formData));
    sessionStorage.setItem("last_prediction_result", JSON.stringify(result));

    // Redirect to results terminal
    router.push("/dashboard/predict/results");
  };

  // Help Tooltips details object
  const TOOLTIPS: Record<string, string> = {
    cp: "Chest Pain Type: 0 = Typical Angina (heavy pressure), 1 = Atypical Angina (sharp, short), 2 = Non-Anginal (muscular/gastric), 3 = Asymptomatic (silent ischemia).",
    trestbps: "Resting Blood Pressure measured on admission in mm Hg. Stage 1 Hypertension begins at 130 mm Hg.",
    chol: "Serum Cholesterol measured in mg/dl. High cholesterol levels (> 240 mg/dl) lead to arterial plaque clogging.",
    fbs: "Fasting Blood Sugar > 120 mg/dl. 1 = Yes (increased cardiovascular risk associated with diabetes), 0 = No.",
    restecg: "Resting Electrocardiogram. 0 = Normal, 1 = ST-T Wave Anomaly (ST elevations/depressions), 2 = Left Ventricular Hypertrophy.",
    thalach: "Maximum Heart Rate achieved during exercise stress testing. Low heart rate responsiveness flags cardiac stiffness.",
    exang: "Exercise-Induced Angina: Chest pain triggered during physical activity. 1 = Yes, 0 = No.",
    oldpeak: "ST segment depression induced by exercise stress relative to rest. Reflects oxygen shortages in the heart muscle.",
    slope: "The slope of the peak exercise ST segment. 0 = Upsloping (normal), 1 = Flat (suspect ischemia), 2 = Downsloping (strong ischemic signature).",
    ca: "Number of major blood vessels (0-4) colored by fluoroscopy. Represents calcified blockages.",
    thal: "Thalassemia genetic perfusion results. 1 = Normal, 2 = Fixed Defect (permanent tissue damage), 3 = Reversible Defect (active risk during stress)."
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none animate-fadeIn">
      {/* 1. Header and Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Diagnostic Panel
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Feed clinical biometric markers to compute mathematical heart disease risk scores.
          </p>
        </div>

        {/* Template Loading triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => handleLoadPreset("athlete")}
            className="border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            🏃 Athlete Preset
          </Button>
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => handleLoadPreset("standard")}
            className="border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            👨 Standard Preset
          </Button>
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => handleLoadPreset("highRisk")}
            className="border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            ⚠️ High-Risk Preset
          </Button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer"
            title="Reset Form"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: General Demographics & Chest Pain */}
          <Card variant="glass" className="border-slate-200/60 dark:border-slate-900 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3 mb-1">
              <ClipboardList className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. General Biometrics
              </h3>
            </div>

            {/* Age Input */}
            <Input
              label="Age (Years)"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
              error={errors.age}
              min="1"
              max="120"
              required
            />

            {/* Sex Input */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sex Assigned at Birth</span>
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleChange("sex", 1)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.sex === 1
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("sex", 0)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.sex === 0
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Chest Pain (CP) select */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Chest Pain (CP) Type</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "cp" ? null : "cp")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              
              {/* Tooltip Overlay */}
              {activeTooltip === "cp" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.cp}
                </div>
              )}

              <select
                value={formData.cp}
                onChange={(e) => handleChange("cp", parseInt(e.target.value))}
                className="w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value={0}>Typical Angina</option>
                <option value={1}>Atypical Angina</option>
                <option value={2}>Non-Anginal Pain</option>
                <option value={3}>Asymptomatic Pain</option>
              </select>
            </div>

            {/* Thalassemia Select */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Thalassemia Profile</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "thal" ? null : "thal")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              
              {activeTooltip === "thal" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.thal}
                </div>
              )}

              <select
                value={formData.thal}
                onChange={(e) => handleChange("thal", parseInt(e.target.value))}
                className="w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value={1}>Normal</option>
                <option value={2}>Fixed Defect</option>
                <option value={3}>Reversible Defect</option>
              </select>
            </div>
          </Card>

          {/* Card 2: Hemodynamics Stats (Heart Rate, Blood Pressure, Chol) */}
          <Card variant="glass" className="border-slate-200/60 dark:border-slate-900 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3 mb-1">
              <Activity className="h-4.5 w-4.5 text-cyan-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Hemodynamic Telemetry
              </h3>
            </div>

            {/* Blood Pressure Input */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resting Blood Pressure (mm Hg)</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "trestbps" ? null : "trestbps")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "trestbps" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.trestbps}
                </div>
              )}
              <Input
                type="number"
                value={formData.trestbps}
                onChange={(e) => handleChange("trestbps", parseInt(e.target.value) || 0)}
                error={errors.trestbps}
                min="50"
                max="250"
                required
              />
            </div>

            {/* Cholesterol Input */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Serum Cholesterol (mg/dl)</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "chol" ? null : "chol")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "chol" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.chol}
                </div>
              )}
              <Input
                type="number"
                value={formData.chol}
                onChange={(e) => handleChange("chol", parseInt(e.target.value) || 0)}
                error={errors.chol}
                min="80"
                max="600"
                required
              />
            </div>

            {/* Max Heart Rate achieved */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Maximum Achieved HR (bpm)</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "thalach" ? null : "thalach")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "thalach" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.thalach}
                </div>
              )}
              <Input
                type="number"
                value={formData.thalach}
                onChange={(e) => handleChange("thalach", parseInt(e.target.value) || 0)}
                error={errors.thalach}
                min="50"
                max="220"
                required
              />
            </div>

            {/* Exercise Angina radio */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Exercise Angina Symptoms</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "exang" ? null : "exang")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "exang" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.exang}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleChange("exang", 1)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.exang === 1
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Positive (Yes)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("exang", 0)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.exang === 0
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Negative (No)
                </button>
              </div>
            </div>
          </Card>

          {/* Card 3: ECG & Obstructions (Slope, vessels, oldpeak) */}
          <Card variant="glass" className="border-slate-200/60 dark:border-slate-900 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3 mb-1">
              <BrainCircuit className="h-4.5 w-4.5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Electrocardiography & Obstructions
              </h3>
            </div>

            {/* Resting ECG */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resting ECG Results</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "restecg" ? null : "restecg")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "restecg" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.restecg}
                </div>
              )}
              <select
                value={formData.restecg}
                onChange={(e) => handleChange("restecg", parseInt(e.target.value))}
                className="w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value={0}>Normal ECG profile</option>
                <option value={1}>ST-T Wave Abnormality</option>
                <option value={2}>Left Ventricular Hypertrophy</option>
              </select>
            </div>

            {/* ST Depression Oldpeak */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ST segment Depression (oldpeak)</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "oldpeak" ? null : "oldpeak")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "oldpeak" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.oldpeak}
                </div>
              )}
              <Input
                type="number"
                step="0.1"
                value={formData.oldpeak}
                onChange={(e) => handleChange("oldpeak", parseFloat(e.target.value) || 0)}
                error={errors.oldpeak}
                min="0"
                max="10"
                required
              />
            </div>

            {/* Slope select */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ST segment Slope</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "slope" ? null : "slope")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "slope" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.slope}
                </div>
              )}
              <select
                value={formData.slope}
                onChange={(e) => handleChange("slope", parseInt(e.target.value))}
                className="w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value={0}>Upsloping</option>
                <option value={1}>Flat ST segment</option>
                <option value={2}>Downsloping (Ischemic)</option>
              </select>
            </div>

            {/* Vessels Fluoroscopy obstruction (ca) select */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Blocked Major Vessels (CA)</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "ca" ? null : "ca")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "ca" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.ca}
                </div>
              )}
              <select
                value={formData.ca}
                onChange={(e) => handleChange("ca", parseInt(e.target.value))}
                className="w-full text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value={0}>0 Vessels narrowed</option>
                <option value={1}>1 Vessel obstructed</option>
                <option value={2}>2 Vessels obstructed</option>
                <option value={3}>3 Vessels obstructed</option>
                <option value={4}>4 Vessels obstructed</option>
              </select>
            </div>

            {/* Fasting sugar (fbs) radio */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fasting Blood Sugar &gt; 120 mg/dl</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "fbs" ? null : "fbs")}
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              {activeTooltip === "fbs" && (
                <div className="absolute top-6 left-0 right-0 z-20 p-3 rounded-xl border border-indigo-500/25 bg-slate-950 text-[10px] leading-relaxed text-indigo-200 shadow-xl">
                  {TOOLTIPS.fbs}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleChange("fbs", 1)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.fbs === 1
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Elevated (Yes)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("fbs", 0)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer
                    ${formData.fbs === 0
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  Normal (No)
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Global form submit actions */}
        <div className="flex justify-end gap-4 mt-4 border-t border-slate-100 dark:border-slate-900 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="font-bold text-xs uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white"
          >
            Clear Markers
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            rightIcon={<ChevronRight className="h-4.5 w-4.5" />}
            className="font-bold text-xs uppercase tracking-widest cursor-pointer shadow-xl shadow-indigo-500/10"
          >
            Predict Heart Disease Risk
          </Button>
        </div>
      </form>
    </div>
  );
}
