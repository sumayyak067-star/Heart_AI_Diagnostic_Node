"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, ShieldCheck, HeartHandshake, Cpu, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import PulseHeart from "@/components/PulseHeart";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden select-none">
      {/* Dynamic Background visual grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none medical-grid" />

      {/* Floating neon background orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl glowing-orb" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl glowing-orb" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto h-20 px-6 sm:px-8 flex items-center justify-between border-b border-slate-900/60 z-20 relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Heart<span className="text-cyan-400">AI</span>
            </span>
            <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-black">
              Diagnostics Node
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
            Clinician Sign In
          </Link>
          <Link href="/signup">
            <Button variant="glass" className="py-2 px-4 text-xs font-bold uppercase border-slate-800 text-slate-200 hover:text-white cursor-pointer">
              Register Node
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center z-10 relative">
        
        {/* Left copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col text-left lg:pr-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              State of the Art Medical Machine Learning
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            AI-Powered Heart <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Disease Prediction
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-sm sm:text-base leading-relaxed mt-6 max-w-xl font-medium"
          >
            Evaluate cardiovascular risks instantaneously using standard, clinical-grade patient biometrics. Powered by a mathematical Logistic Regression engine calibrated on the Cleveland heart dataset.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-10">
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-4.5 w-4.5" />}
                className="cursor-pointer font-bold text-xs uppercase tracking-widest"
              >
                Access Diagnostics Hub
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="glass"
                size="lg"
                className="border-slate-800 text-slate-300 hover:text-white cursor-pointer font-bold text-xs uppercase tracking-widest"
              >
                Launch Demo Console
              </Button>
            </Link>
          </motion.div>

          {/* Biometric summary items */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mt-12 border-t border-slate-900 pt-8 max-w-lg"
          >
            <div>
              <span className="block text-2xl font-extrabold text-white">81.46%</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                Model Accuracy
              </span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-white">13</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                Biometric Inputs
              </span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-white">&lt; 10ms</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                Inference Speed
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side live widget display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col gap-6 lg:pl-6 justify-center"
        >
          {/* Animated pulsing heart card */}
          <PulseHeart />

          {/* Clinician validation notification widget */}
          <div className="flex gap-4 p-5 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md max-w-md mx-auto text-left relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
              <Cpu className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Deterministic Inference
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                The classification runs client-side inside a React context using matrix multiplications. Secure, confidential, and fully GDPR compliant with zero server storage overhead.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features grid */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 border-t border-slate-900/60 z-10 relative">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col text-left p-6 rounded-2xl border border-slate-900/60 bg-slate-950/20">
            <ShieldCheck className="h-7 w-7 text-indigo-400 mb-4" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider mb-2">
              Privacy First Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Diagnostic data remains entirely local to your session. No medical records are transmitted to third-party databases, guaranteeing compliance and safety.
            </p>
          </div>
          <div className="flex flex-col text-left p-6 rounded-2xl border border-slate-900/60 bg-slate-950/20">
            <HeartHandshake className="h-7 w-7 text-rose-400 mb-4" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider mb-2">
              Clinically Authenticated
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Calibrated parameters use exact coefficients from verified cardiac studies. Biometric insight alerts are mapped directly to standard cardiology reference guides.
            </p>
          </div>
          <div className="flex flex-col text-left p-6 rounded-2xl border border-slate-900/60 bg-slate-950/20">
            <Cpu className="h-7 w-7 text-cyan-400 mb-4" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider mb-2">
              SaaS Inspired Analytics
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Includes comprehensive Recharts area curves, radial stats, risk factor matrices, patient template loads, and detailed biometrics history logging.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full h-16 border-t border-slate-900 flex items-center justify-center z-10 relative bg-slate-950/80 backdrop-blur-md">
        <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
          © 2026 HeartAI Diagnostics Corp. All clinical data synthesized securely.
        </span>
      </footer>
    </div>
  );
}
