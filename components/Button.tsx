"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variantStyles: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/10 border border-indigo-500/10",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700",
    glass:
      "bg-white/10 hover:bg-white/20 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-slate-200/20 dark:border-slate-800/40 shadow-sm",
    outline:
      "bg-transparent border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-sm border border-rose-500/10",
    success:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm border border-emerald-500/10",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const isDisabled = disabled || isLoading;
  const mergedClasses = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <motion.div
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      style={{ display: "inline-flex" }}
    >
      <button
        type={type}
        disabled={isDisabled}
        className={mergedClasses}
        onClick={onClick}
        {...rest}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex">{leftIcon}</span>
        ) : null}

        {children}

        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex">{rightIcon}</span>
        )}
      </button>
    </motion.div>
  );
}
