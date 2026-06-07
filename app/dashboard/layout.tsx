"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useApp();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple route check: if no user in session, redirect to login
  useEffect(() => {
    // Wait briefly for hydration
    const savedUser = localStorage.getItem("heart_user");
    if (!savedUser && !user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    // Simple placeholder to prevent visual glitches during redirect
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <span className="animate-pulse font-bold text-xs uppercase tracking-widest">
          Authenticating Clinician Node...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Sidebar Navigation (Left Panel) */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* 2. Main Content Wrapper */}
      <div className="flex-grow flex flex-col lg:pl-64 min-h-screen">
        {/* Top Navbar */}
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Dynamic Workspace Container */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl mx-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
