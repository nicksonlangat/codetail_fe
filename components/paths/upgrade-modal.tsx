"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, WandSparkles, X, Zap } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

// Mirrors components/marketing/pricing.tsx's Pro card — same price, same
// feature list. Keep both in sync if the plan ever changes.
const PRO_FEATURES = [
  "All problems unlocked",
  "Unlimited AI reviews",
  "Unlimited AI hints",
  "Unlimited solution reveals",
  "AI-generated custom challenges",
  "Daily practice emails",
  "Full progress analytics",
  "Priority support",
];

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: string;
}

export function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-brand-text/40 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={SP}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border-2 border-brand-primary/40 bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 size-7 rounded-lg flex items-center justify-center text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                <WandSparkles className="size-4 text-brand-primary" />
              </span>
              <h2 className="text-xs font-semibold text-brand-primary uppercase tracking-wide">
                Codetail Pro
              </h2>
            </div>

            {trigger && (
              <p className="text-[13px] text-brand-text mt-3 leading-relaxed">{trigger}</p>
            )}

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-bold font-mono text-brand-text">$9</span>
              <span className="text-sm text-brand-text-muted">/ month</span>
            </div>
            <p className="text-[12px] text-brand-text-muted mt-1">or $90/year, save $18</p>

            <Link
              href="/signup"
              className="flex items-center justify-center gap-1.5 w-full text-center text-[13px] font-semibold text-white bg-brand-primary py-2.5 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover mt-5"
            >
              <Zap className="size-3.5" />
              Upgrade to Pro
            </Link>

            <div className="mt-5 space-y-2">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-[13px] text-brand-text">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
