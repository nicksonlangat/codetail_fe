"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: string;
}

const freeFeatures = [
  "5 problems per path",
  "3 AI reviews / day",
  "2 AI hints / day",
  "1 solution reveal / day",
  "Unlimited code execution",
  "MCQ unlimited",
];

const proFeatures = [
  "All problems unlocked",
  "Unlimited AI reviews",
  "Unlimited AI hints",
  "Unlimited solution reveals",
  "AI-generated custom challenges",
  "Full progress analytics",
  "Priority support",
];

export function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[520px] mx-4 rounded-2xl border border-border bg-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={spring}
          >
            {/* Close button */}
            <button onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500 z-10">
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">Upgrade to Pro</h2>
              </div>
              {trigger && (
                <p className="text-[12px] text-muted-foreground mt-1">{trigger}</p>
              )}
            </div>

            {/* Plans */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Free */}
                <div className="rounded-xl border border-border p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Free</span>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-2xl font-bold font-mono">$0</span>
                    <span className="text-[11px] text-muted-foreground/40">forever</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 mb-3">Get started</p>
                  <div className="h-8 flex items-center justify-center text-[11px] font-medium text-muted-foreground border border-border/60 rounded-lg mb-3">
                    Current plan
                  </div>
                  <div className="space-y-1.5">
                    {freeFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 mt-px" />
                        <span className="text-[11px] text-muted-foreground/60 leading-tight">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro */}
                <div className="rounded-xl border-2 border-primary/40 bg-primary/[0.03] p-4 relative">
                  <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Pro</span>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-2xl font-bold font-mono">$9</span>
                    <span className="text-[11px] text-muted-foreground/40">/ month</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 mb-3">Unlimited everything</p>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    className="w-full h-8 flex items-center justify-center gap-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg cursor-pointer transition-all duration-500 mb-3"
                  >
                    <Zap className="w-3 h-3" />
                    Upgrade to Pro
                  </motion.button>
                  <div className="space-y-1.5">
                    {proFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-px" />
                        <span className="text-[11px] text-foreground leading-tight">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/40">14-day money-back guarantee</span>
              <button onClick={onClose} className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
