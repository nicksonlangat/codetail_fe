"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ModalVariant = "confirm" | "success" | "info" | null;

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function ConfirmModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Delete Solution?</h3>
        <p className="text-[12px] text-muted-foreground mt-1 max-w-[240px] mx-auto">
          This action cannot be undone. Your solution and all associated data will be permanently removed.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-500 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...spring, delay: 0.15 }}
          />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Solution Accepted!</h3>
        <p className="text-[12px] text-muted-foreground mt-1">
          Runtime: 4ms &middot; Memory: 42.1 MB
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">98</p>
          <p className="text-[10px] text-muted-foreground">Score</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">Top 5%</p>
          <p className="text-[10px] text-muted-foreground">Percentile</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="px-4 py-1.5 rounded-lg text-[11px] font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-500 cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">About Difficulty Ratings</h3>
          <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
            Problems are rated on a scale from 1-10 based on algorithmic complexity,
            required data structures, and average solve time across all users.
          </p>
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-500 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function ModalSystem() {
  const [active, setActive] = useState<ModalVariant>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, close]);

  const triggers: { label: string; variant: ModalVariant; style: string }[] = [
    { label: "Confirm Delete", variant: "confirm", style: "bg-red-500/10 text-red-600 hover:bg-red-500/20" },
    { label: "Success", variant: "success", style: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "Info", variant: "info", style: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" },
  ];

  return (
    <div className="min-h-[80px]">
      <div className="flex flex-wrap gap-2">
        {triggers.map((t) => (
          <motion.button
            key={t.label}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-500 cursor-pointer ${t.style}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(t.variant)}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm cursor-pointer"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative bg-card rounded-2xl border border-border/50 shadow-xl p-6 w-[340px] max-w-[90vw]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={spring}
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {active === "confirm" && <ConfirmModal onClose={close} />}
              {active === "success" && <SuccessModal onClose={close} />}
              {active === "info" && <InfoModal onClose={close} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
