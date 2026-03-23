"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; borderColor: string; label: string; message: string }> = {
  success: { icon: CheckCircle2, borderColor: "border-l-green-500", label: "Success", message: "Solution accepted!" },
  error: { icon: XCircle, borderColor: "border-l-red-500", label: "Error", message: "Compilation failed" },
  info: { icon: Info, borderColor: "border-l-blue-500", label: "Info", message: "New path unlocked" },
  warning: { icon: AlertTriangle, borderColor: "border-l-yellow-500", label: "Warning", message: "Time running low" },
};

const buttonStyles: Record<ToastType, string> = {
  success: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  error: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
  info: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  warning: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
};

const iconColors: Record<ToastType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-yellow-500",
};

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

export function ToastSystem() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((type: ToastType) => {
    const id = ++counterRef.current;
    const config = toastConfig[type];
    setToasts((prev) => [...prev, { id, type, message: config.message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="relative min-h-[200px]">
      {/* Trigger buttons */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(toastConfig) as ToastType[]).map((type) => (
          <motion.button
            key={type}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-500 ${buttonStyles[type]}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => addToast(type)}
          >
            {toastConfig[type].label}
          </motion.button>
        ))}
      </div>

      {/* Toast container */}
      <div className="absolute bottom-0 right-0 flex flex-col-reverse gap-2 max-w-[240px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ y: 20, scale: 0.9, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ x: 80, scale: 0.9, opacity: 0 }}
                transition={spring}
                className={`surface-elevated rounded-xl border-l-4 ${config.borderColor} px-3 py-2.5 flex items-start gap-2`}
              >
                <Icon className={`w-3.5 h-3.5 mt-px flex-shrink-0 ${iconColors[toast.type]}`} />
                <span className="text-[12px] text-foreground flex-1 leading-tight">
                  {toast.message}
                </span>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-muted-foreground hover:text-foreground transition-all duration-500 flex-shrink-0 mt-px"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
