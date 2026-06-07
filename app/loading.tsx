"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Pulsing Scanner animation */}
        <div className="relative h-20 w-20 flex items-center justify-center border border-indigo-500/20 rounded-2xl bg-slate-950 p-2 shadow-2xl">
          <Activity className="h-10 w-10 text-cyan-400 animate-pulse" />
          {/* Diagnostic scanner bar */}
          <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgb(34,211,238)] animate-[bounce_2s_infinite]" />
        </div>
        
        <h3 className="font-extrabold text-sm uppercase tracking-widest text-slate-200 mt-6 animate-pulse">
          Calibrating Core AI Weights
        </h3>
        <p className="text-[11px] text-slate-500 mt-2 font-medium tracking-wide">
          Syncing cardiological diagnostic nodes...
        </p>
      </div>
    </div>
  );
}
