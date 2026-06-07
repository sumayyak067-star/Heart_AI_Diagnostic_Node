"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  LayoutDashboard,
  BrainCircuit,
  BarChart3,
  History,
  User,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Sidebar({
  className = "",
  isOpen = false,
  onClose
}: {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { logout, user } = useApp();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Prediction", href: "/dashboard/predict", icon: BrainCircuit },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "History", href: "/dashboard/history", icon: History },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-900 border-r border-slate-800 p-6 text-slate-100 relative z-40 select-none">
      {/* Top logo */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
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
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all group cursor-pointer
                  ${
                    isActive
                      ? "text-white bg-slate-800 border border-slate-700/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
              >
                {/* Active indicator overlay */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-y-2 left-0 w-1 rounded-r bg-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                <span>{item.label}</span>
                
                {item.label === "Prediction" && (
                  <span className="ml-auto text-[9px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Logout */}
      <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-6">
        {user && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-sm text-cyan-400 uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-slate-200 truncate leading-none mb-1">
                {user.name}
              </h5>
              <span className="text-[10px] text-slate-500 truncate block leading-none font-medium">
                {user.medicalId || "MED-80234"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 text-rose-400" />
          <span>Exit Node</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left Panel) */}
      <div className={`hidden lg:block w-64 h-screen fixed top-0 left-0 ${className}`}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fadeIn"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-64 h-full z-40 transition-transform duration-300 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
