"use client";

import React, { useState } from "react";
import { Sun, Moon, Bell, Search, Menu, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar({
  onMobileMenuToggle
}: {
  onMobileMenuToggle: () => void;
}) {
  const { theme, toggleTheme, user } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulated notifications list for diagnostic atmosphere
  const notifications = [
    { id: 1, title: "Diagnostic Node Synced", text: "Successfully linked Cleveland core weights", read: false },
    { id: 2, title: "High-Risk Threshold Met", text: "Saved prediction pred-9034 flagged warning", read: false },
    { id: 3, title: "System Ready", text: "AI heart classifier is active and serverless", read: true }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 border-b border-slate-200/80 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md text-slate-800 dark:text-slate-100 select-none">
      {/* Left side Search & Mobile Menu Trigger */}
      <div className="flex items-center gap-4 flex-grow max-w-md">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="hidden sm:flex items-center w-full relative group">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search diagnostic records..."
            className="w-full text-xs py-2 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-slate-950 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200 cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Hub */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200 relative cursor-pointer
              ${showNotifications ? "border-indigo-500/20 bg-indigo-500/5" : "border-slate-200 dark:border-slate-850"}`}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 shadow-2xl z-20 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                    Notification Terminal
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-bold">2 Unread</span>
                </div>
                <div className="flex flex-col max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-start gap-3
                        ${!n.read ? "bg-slate-50/50 dark:bg-slate-900/20" : ""}`}
                    >
                      <div className={`h-2 w-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? "bg-cyan-400" : "bg-slate-400"}`} />
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {n.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {n.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-850 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 uppercase tracking-widest cursor-pointer"
                  >
                    Clear All Alerts
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-2 border-l border-slate-200/85 dark:border-slate-855 pl-3">
            <span className="hidden md:block text-right">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                {user.name}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5 leading-none">
                {user.medicalId || "MED-80234"}
              </span>
            </span>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-black select-none border border-indigo-400/20">
              {user.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
