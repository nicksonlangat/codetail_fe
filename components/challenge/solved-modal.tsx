"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { BADGE_DEFS } from "@/lib/badges";

const BADGE_ICONS: Record<string, string> = {
  "first-blood":  "🩸",
  "week-warrior": "🔥",
  debugger:       "🐛",
  "unit-clear":   "✅",
  pythonista:     "🐍",
  "django-dev":   "🎸",
  "path-blazer":  "🚀",
  "the-50":       "💯",
  "hard-mode":    "💪",
};

const MESSAGES = [
  "Keep the streak alive.",
  "Clean work. Next one awaits.",
  "One more down. Keep going.",
  "That's the way. Don't stop now.",
  "Momentum builds. Keep it up.",
  "Solid. Stay in the zone.",
];

const SP = { type: "spring" as const, stiffness: 300, damping: 28 };

interface SolvedModalProps {
  xpEarned: number;
  newTotal: number;
  newBadges: string[];
  onDismiss: () => void;
}

export function SolvedModal({ xpEarned, newTotal, newBadges, onDismiss }: SolvedModalProps) {
  const fired = useRef(false);
  const message = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = ["#0898a0", "#ffffff", "#fbbf24", "#f97316"];
    confetti({ particleCount: 110, spread: 72, origin: { y: 0.5 }, colors, scalar: 1.1 });
    setTimeout(() => {
      confetti({ particleCount: 55, spread: 55, origin: { x: 0.1, y: 0.6 }, colors, angle: 60 });
      confetti({ particleCount: 55, spread: 55, origin: { x: 0.9, y: 0.6 }, colors, angle: 120 });
    }, 240);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={SP}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl shadow-brand-primary/10 border border-brand-border overflow-hidden"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
          >
            <X className="size-4" />
          </button>

          {/* Hero */}
          <div className="bg-gradient-to-b from-brand-primary/8 to-transparent px-6 pt-8 pb-5 text-center">
            <motion.div
              initial={{ scale: 0.4, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
              className="text-5xl mb-4 select-none"
            >
              🎉
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-primary mb-3">
                Challenge solved
              </p>
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <Zap className="size-5 text-brand-primary shrink-0" fill="currentColor" />
                <span className="text-3xl font-bold text-brand-text">+{xpEarned} XP</span>
              </div>
              <p className="text-[13px] text-brand-text-muted">
                Your total:{" "}
                <span className="font-semibold text-brand-text">{newTotal.toLocaleString()} XP</span>
              </p>
            </motion.div>
          </div>

          {/* Badges */}
          {newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="px-6 pb-4 border-t border-brand-border pt-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-muted mb-2.5">
                {newBadges.length === 1 ? "Badge unlocked" : `${newBadges.length} badges unlocked`}
              </p>
              <div className="flex flex-col gap-2">
                {newBadges.map((id) => {
                  const def = BADGE_DEFS[id];
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-brand-primary/25 bg-brand-primary/5"
                    >
                      <span className="text-2xl select-none shrink-0">{BADGE_ICONS[id] ?? "🏅"}</span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-brand-text">{def?.label ?? id}</p>
                        {def?.description && (
                          <p className="text-[11.5px] text-brand-text-muted leading-snug">{def.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <div className="px-6 pb-6 pt-4">
            <p className="text-[12.5px] text-brand-text-muted text-center mb-3">
              {message.current}
            </p>
            <motion.button
              type="button"
              onClick={onDismiss}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={SP}
              className="w-full py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover"
            >
              Keep going
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
