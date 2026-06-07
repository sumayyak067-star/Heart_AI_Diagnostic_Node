"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  toast,
  onClose
}: {
  toast: { id: string; title: string; message: string; type: "success" | "error" | "info" | "warning" };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-cyan-500 flex-shrink-0" />
  };

  const borders = {
    success: "border-emerald-500/20 bg-emerald-950/20 dark:bg-emerald-950/30",
    error: "border-rose-500/20 bg-rose-950/20 dark:bg-rose-950/30",
    warning: "border-amber-500/20 bg-amber-950/20 dark:bg-amber-950/30",
    info: "border-cyan-500/20 bg-cyan-950/20 dark:bg-cyan-950/30"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${borders[toast.type]} text-neutral-800 dark:text-neutral-200`}
    >
      {icons[toast.type]}
      <div className="flex-grow">
        <h4 className="font-semibold text-sm leading-none mb-1 text-neutral-900 dark:text-neutral-50">
          {toast.title}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-0.5 rounded-lg hover:bg-neutral-200/20"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
