"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, User, Sparkles, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Unentered");
  const [strengthColor, setStrengthColor] = useState("bg-slate-800");

  // Real-time password strength scoring
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthLabel("Unentered");
      setStrengthColor("bg-slate-800");
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);

    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Excellent"];
    const colors = ["bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"];

    setStrengthLabel(labels[score]);
    setStrengthColor(colors[score]);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All credentials must be fully filled out.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passcodes do not match. Verify entries.");
      return;
    }

    if (password.length < 8) {
      setError("Passcode is too short. Minimum 8 characters required.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the HIPAA diagnostic privacy conditions.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none medical-grid" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl glowing-orb" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl glowing-orb" />

      {/* 1. Left Side Clinician Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950/80 border-r border-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        
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

        <div className="z-10 max-w-md my-auto flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 self-start mb-6">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Registration Portal
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-white leading-tight">
            "Register diagnostic profiles. Map cardiovascular telemetry."
          </h2>
          
          <p className="text-xs text-slate-500 mt-6 leading-relaxed font-medium">
            Join hundreds of cardiological professionals using local machine learning calculations to streamline diagnostics evaluation speed.
          </p>

          <Card variant="glow" className="mt-8 p-5 border-slate-900 bg-slate-950/80">
            <span className="block text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">
              Diagnostic Privileges
            </span>
            <ul className="text-xs text-slate-400 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Full access to Recharts analytics historical trend curves.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Calibrate parameters using Cleveland trained coefficients.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Export diagnostic history logs instantly.
              </li>
            </ul>
          </Card>
        </div>

        <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest z-10">
          HeartAI Secure Clinician Session Node. All credentials validated.
        </span>
      </div>

      {/* 2. Right Side Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card variant="glass" className="w-full p-8 border-slate-900 bg-slate-950/60 shadow-2xl backdrop-blur-lg">
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-black tracking-tight text-white uppercase">
                Register Workspace
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Set up your clinical diagnostician credentials
              </p>
            </div>

            {error && (
              <div className="flex gap-2.5 p-3.5 mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs text-left leading-normal">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name (Clinical Identifier)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Carter"
                leftIcon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Clinical Email Node"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.carter@healthai.com"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Diagnostics Passcode"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
                
                {/* Real-time passcode strength bar indicators */}
                {password && (
                  <div className="flex flex-col gap-1 mt-1 select-none">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Passcode Strength</span>
                      <span className="text-slate-350">{strengthLabel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${Math.max(strength * 25, 10)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Verify Passcode"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              {/* Accept HIPAA terms */}
              <label className="flex items-start gap-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer h-3.5 w-3.5 mt-0.5"
                />
                <span className="leading-snug">
                  I certify these credentials represent a valid clinical diagnostic account under secure HIPAA local privacy regulations.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Register Diagnostics Token
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-5">
              <div className="w-full border-t border-slate-900" />
              <span className="absolute px-3 bg-slate-950 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest select-none">
                or register with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit}
              className="w-full border-slate-900 text-slate-300 hover:text-white bg-slate-950/40 font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Register with Google OAuth
            </Button>

            <p className="text-center text-xs text-slate-500 mt-6 font-semibold select-none">
              Already registered?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign In to Workstation
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
