"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [name, setName] = useState("Dr. Alex Carter");
  const [email, setEmail] = useState("alex.carter@healthai.com");
  const [password, setPassword] = useState("securepassword123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please supply both login email and security passcode.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, name);
      router.push("/dashboard");
    } catch {
      setError("Diagnostic session initiation failed. Verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex relative overflow-hidden select-none">
      {/* Visual background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none medical-grid" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl glowing-orb" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl glowing-orb" />

      {/* 1. Left Side: Clinician Information Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950/80 border-r border-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Sweeping background orb */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        
        {/* Header Logo */}
        <Link href="/" className="flex items-center gap-2.5 z-10 self-start group">
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

        {/* Center Quote / Telemetry Mock */}
        <div className="z-10 max-w-md my-auto flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 self-start mb-6">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Biometric Diagnostics Module
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-white leading-tight">
            "Validating heart anomalies with mathematical absolute precision."
          </h2>
          
          <p className="text-xs text-slate-500 mt-6 leading-relaxed font-medium">
            Access secure telemetry diagnostics dashboards, review patient classification logs, load cardiological biometrics presets, and manage diagnostic classifications securely from this workstation.
          </p>

          {/* Clinician validation statistics card */}
          <Card variant="glow" className="mt-8 p-5 border-slate-900 bg-slate-950/80">
            <span className="block text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">
              Telemetry Calibrations
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xl font-bold text-white">81.46%</span>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                  Logistic Classification
                </span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white">100%</span>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                  Local HIPAA Privacy
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom copyright */}
        <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest z-10">
          HeartAI Secure Clinician Session Node. All credentials validated.
        </span>
      </div>

      {/* 2. Right Side: Interactive Sliding Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card variant="glass" className="w-full p-8 border-slate-900 bg-slate-950/60 shadow-2xl backdrop-blur-lg">
            
            {/* Header info */}
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  ❤️
                </div>
                <span className="font-extrabold text-sm text-white tracking-widest">
                  HEART<span className="text-cyan-400">AI</span>
                </span>
              </div>
              
              <h3 className="text-xl font-black tracking-tight text-white uppercase">
                Clinician Portal
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                Access your secure diagnostic workspace
              </p>
            </div>

            {/* Error dialog */}
            {error && (
              <div className="flex gap-2.5 p-3.5 mb-6 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs text-left leading-normal">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Full Name (Clinical Identifier)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Carter"
                leftIcon={<Mail className="h-4 w-4" />} // Left icon
                required
              />

              <Input
                label="Medical Email Node"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.carter@healthai.com"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Diagnostic Passcode"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              {/* Extras Row */}
              <div className="flex items-center justify-between text-xs font-semibold select-none">
                <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                  />
                  <span>Keep session active</span>
                </label>
                <Link
                  href="#"
                  onClick={() => alert("Simulated: Check default passcode 'securepassword123' to proceed.")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Code?
                </Link>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Access Workstation
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-slate-900" />
              <span className="absolute px-3 bg-slate-950 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest select-none">
                or authenticate with
              </span>
            </div>

            {/* Simulated Google Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit}
              className="w-full border-slate-900 text-slate-300 hover:text-white bg-slate-950/40 font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Google OAuth Token
            </Button>

            {/* Footer switcher links */}
            <p className="text-center text-xs text-slate-500 mt-8 font-semibold select-none">
              Not registered?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Register Diagnostic Node
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
