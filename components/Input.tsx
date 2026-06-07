"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  type = "text",
  className = "",
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && showPassword ? "text" : type;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={actualType}
          className={`w-full text-sm py-2.5 px-4 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all duration-200 outline-none
            ${leftIcon ? "pl-11" : ""} 
            ${isPassword ? "pr-11" : ""} 
            ${error
              ? "border-rose-500/50 dark:border-rose-500/40 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500"
              : "border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/60"
            } 
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-500 select-none animate-fadeIn">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 select-none">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
