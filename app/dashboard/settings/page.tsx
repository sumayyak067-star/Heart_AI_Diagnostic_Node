"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Trash2,
  Cpu,
  Info,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme, clearHistory, addToast, predictions } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionAutoClear, setSessionAutoClear] = useState(false);

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    addToast(
      "Alarms Preference",
      !soundEnabled ? "Cardiological alert beeps enabled." : "Cardiological alert beeps silenced.",
      "info"
    );
  };

  const handleMemoryFlush = () => {
    if (confirm("Flush all diagnostic caches, prediction runs, and temporary patient template indices permanently?")) {
      clearHistory();
      sessionStorage.clear();
      addToast("Memory Reset", "Diagnostic node memory flushed. Restored raw factory presets.", "success");
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none animate-fadeIn">
      {/* 1. Header Copy */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          System Preferences
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Configure security, visual UI themes, clinical acoustic beeps, and review mathematical model variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: System details summary (1/3 width) */}
        <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-900 pb-3 mb-1">
              <Cpu className="h-5 w-5 text-indigo-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Mathematical Engine Spec
              </h3>
            </div>
            
            <div className="flex flex-col gap-3.5 text-xs font-medium text-slate-550 leading-relaxed">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Classifier Node</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">Logistic Regression Engine</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Model Intercept</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono font-bold block mt-0.5">4.519865</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Features count</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">13 clinical parameters</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Training baseline size</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">303 Cleveland clinic entries</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Inference protocol</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">Serverless client-side React matrix</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-start mt-6 p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-850">
            <Info className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              This node operates entirely local. Any diagnostic data remains private on your machine.
            </p>
          </div>
        </Card>

        {/* Right Side: Options & Actions forms (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card 1: Preferences UI & Sounds */}
          <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              UI & Interface Preferences
            </h4>

            <div className="flex flex-col gap-6">
              {/* Theme preference */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Visual Workspace Theme
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Switch between sleek clinical dark mode and bright clinical light mode.
                  </span>
                </div>
                
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 select-none">
                  <button
                    onClick={() => { if (theme !== "light") toggleTheme(); }}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all
                      ${theme === "light" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    <Sun className="h-4 w-4" />
                    <span className="hidden sm:inline">Light</span>
                  </button>
                  <button
                    onClick={() => { if (theme !== "dark") toggleTheme(); }}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all
                      ${theme === "dark" ? "bg-slate-850 text-white border border-slate-700/50 shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    <Moon className="h-4 w-4" />
                    <span className="hidden sm:inline">Dark</span>
                  </button>
                </div>
              </div>

              {/* Sound preference */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-6">
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Cardiological Acoustic Beeps
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Acoustic diagnostic warning triggers on critical prediction anomalies.
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={handleSoundToggle}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border flex items-center gap-2.5 transition-all cursor-pointer
                    ${soundEnabled
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-200"}`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Alarms active</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Alarms muted</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Card 2: Memory & HIPAA Compliance settings */}
          <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Memory & Security Controls
            </h4>

            <div className="flex flex-col gap-6">
              
              {/* Auto Clear session */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Session Auto-Clear Cache
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Instantly wipe all diagnostic patient logs upon clinical browser logout.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sessionAutoClear}
                    onChange={() => setSessionAutoClear(!sessionAutoClear)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-cyan-400 peer-checked:bg-cyan-950 peer-checked:border-cyan-800/40 border border-slate-700" />
                </label>
              </div>

              {/* Memory flush button */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-6">
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Hard System Reset
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Permanently flush local log archives ({predictions.length} diagnostic files) and restore baseline defaults.
                  </span>
                </div>
                
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleMemoryFlush}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  className="font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Flush Cache
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
