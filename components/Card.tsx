"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "glow" | "danger" | "success";
  hoverable?: boolean;
  animate?: boolean;
  delay?: number;
  id?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  animate = false,
  delay = 0,
  id,
  onClick,
}: CardProps) {
  const baseStyle =
    "rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden";

  const variantStyles: Record<string, string> = {
    default:
      "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm",
    glass:
      "bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border-slate-200/50 dark:border-slate-800/40 shadow-md",
    glow:
      "bg-slate-900/90 dark:bg-slate-950/80 border-indigo-500/20 dark:border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)]",
    danger:
      "bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-950/30 shadow-sm",
    success:
      "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-950/30 shadow-sm",
  };

  const hoverStyle = hoverable
    ? "hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
    : "";

  const mergedClasses = `${baseStyle} ${variantStyles[variant]} ${hoverStyle} ${className}`;

  const glowOrb = variant === "glow" && (
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={mergedClasses}
        id={id}
        onClick={onClick}
      >
        {glowOrb}
        {children}
      </motion.div>
    );
  }

  return (
    <div className={mergedClasses} id={id} onClick={onClick}>
      {glowOrb}
      {children}
    </div>
  );
}
