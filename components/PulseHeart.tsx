"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Shield } from "lucide-react";

export default function PulseHeart() {
  const [bpm, setBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [hrv, setHrv] = useState(55);

  useEffect(() => {
    // Micro fluctuations in heart rate, oxygen and HRV to simulate real clinical sensors
    const interval = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next > 80 ? 76 : next < 65 ? 68 : next;
      });
      setSpo2((prev) => {
        const roll = Math.random();
        if (roll > 0.9) return 99;
        if (roll > 0.8) return 97;
        return prev;
      });
      setHrv((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next > 65 ? 60 : next < 45 ? 48 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-video rounded-3xl border border-indigo-500/10 dark:border-indigo-500/20 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden shadow-2xl shadow-indigo-500/5">
      {/* Background medical grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />

      {/* Radial sweep glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Info Bar */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            Realtime Cardiac Monitor
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
            Secured AI Node
          </span>
        </div>
      </div>

      {/* Center Heart and EKG wave */}
      <div className="relative h-28 flex items-center justify-center z-10 my-4">
        {/* Pulsing visual Heart */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1.05, 1.2, 1],
            opacity: [0.8, 1, 0.9, 1, 0.8]
          }}
          transition={{
            duration: 60 / bpm, // Perfect sync to dynamic beats-per-minute!
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute text-rose-500/20 dark:text-rose-500/15"
        >
          <Heart className="h-28 w-28 fill-current" />
        </motion.div>

        {/* EKG Vector Line Wave */}
        <svg
          viewBox="0 0 400 100"
          className="w-full h-full text-indigo-400 dark:text-indigo-400/90"
          style={{ strokeWidth: 2, fill: "none" }}
        >
          <motion.path
            d="M 0,50 L 80,50 L 95,50 L 105,35 L 115,65 L 125,50 L 135,50 L 140,50 L 148,15 L 158,85 L 168,50 L 180,50 L 260,50 L 275,50 L 285,35 L 295,65 L 305,50 L 315,50 L 320,50 L 328,15 L 338,85 L 348,50 L 360,50 L 400,50"
            stroke="currentColor"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
      </div>

      {/* Bottom telemetry values */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-4 z-10">
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Beats / Min
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-xl font-black text-rose-500 tabular-nums">
              {bpm}
            </span>
            <span className="text-[9px] font-bold text-rose-400 animate-ping">
              ❤️
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center border-x border-slate-900">
          <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Oxygen SpO2
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-xl font-black text-cyan-400 tabular-nums">
              {spo2}
            </span>
            <span className="text-[9px] font-bold text-slate-500">%</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            HRV Score
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-xl font-black text-emerald-400 tabular-nums">
              {hrv}
            </span>
            <span className="text-[9px] font-bold text-slate-500">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
