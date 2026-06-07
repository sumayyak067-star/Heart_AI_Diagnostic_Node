"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background medical grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />

      {/* Floating neon background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl glowing-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl glowing-orb" />

      <div className="z-10 text-center max-w-lg flex flex-col items-center">
        {/* Flatline EKG Animation */}
        <div className="relative w-full max-w-sm h-32 flex items-center justify-center mb-8 border border-rose-500/20 rounded-3xl bg-slate-950/80 p-4">
          <svg
            viewBox="0 0 400 100"
            className="w-full h-full text-rose-500"
            style={{ strokeWidth: 3, fill: "none" }}
          >
            <motion.path
              d="M 0,50 L 100,50 L 115,50 L 125,20 L 135,80 L 145,50 L 155,50 L 400,50"
              stroke="currentColor"
              strokeDasharray="400"
              initial={{ strokeDashoffset: 400 }}
              animate={{ strokeDashoffset: [400, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest text-rose-500">
              Cardiac State: Flatline
            </span>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-black bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-extrabold mt-3 text-slate-100"
        >
          Diagnostic Path Lost
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-sm mt-4 leading-relaxed max-w-sm"
        >
          We've lost the telemetry signal for this coordinate. The page is flatlining or does not exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link href="/">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 bg-slate-950/40 cursor-pointer"
            >
              Back to Home Node
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
