"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

const SP = { type: "spring" as const, stiffness: 300, damping: 28 };

interface BadgeModalProps {
  newBadges: string[];
  allEarned: string[];
  onDismiss: () => void;
}

export function BadgeModal({ newBadges, allEarned, onDismiss }: BadgeModalProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const colors = ["#0898a0", "#ffffff", "#fbbf24", "#f97316"];

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors,
      scalar: 1.1,
    });

    setTimeout(() => {
      confetti({ particleCount: 60, spread: 55, origin: { x: 0.1, y: 0.6 }, colors, angle: 60 });
      confetti({ particleCount: 60, spread: 55, origin: { x: 0.9, y: 0.6 }, colors, angle: 120 });
    }, 200);
  }, []);

  const primaryBadge = newBadges[0];
  const def = BADGE_DEFS[primaryBadge];
  const allBadgeIds = Object.keys(BADGE_DEFS);

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
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={SP}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-brand-primary/10 border border-brand-border overflow-hidden"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
          >
            <X className="size-4" />
          </button>

          {/* Hero */}
          <div className="bg-gradient-to-b from-brand-primary/8 to-transparent px-6 pt-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="text-6xl mb-4 select-none"
            >
              {BADGE_ICONS[primaryBadge] ?? "🏅"}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-primary mb-1">
                Badge unlocked
              </p>
              <h2 className="text-xl font-bold text-brand-text mb-1">
                {def?.label ?? primaryBadge}
              </h2>
              <p className="text-[13px] text-brand-text-muted">{def?.description}</p>

              {newBadges.length > 1 && (
                <p className="mt-2 text-[12px] text-brand-primary font-medium">
                  +{newBadges.length - 1} more badge{newBadges.length > 2 ? "s" : ""} earned
                </p>
              )}
            </motion.div>
          </div>

          {/* Arsenal */}
          <div className="px-6 pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
              Your arsenal — {allEarned.length} of {allBadgeIds.length}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {allBadgeIds.map((id) => {
                const earned = allEarned.includes(id);
                const isNew = newBadges.includes(id);
                const badgeDef = BADGE_DEFS[id];
                return (
                  <div
                    key={id}
                    title={earned ? badgeDef?.description : `Locked: ${badgeDef?.label}`}
                    className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 border transition-all duration-300 ${
                      isNew
                        ? "border-brand-primary/40 bg-brand-primary/5 ring-1 ring-brand-primary/20"
                        : earned
                        ? "border-brand-border bg-brand-surface/50"
                        : "border-brand-border/50 bg-transparent opacity-35"
                    }`}
                  >
                    <span className={`text-xl select-none ${!earned ? "grayscale" : ""}`}>
                      {BADGE_ICONS[id] ?? "🏅"}
                    </span>
                    <span className="text-[10px] font-medium text-brand-text text-center leading-tight">
                      {badgeDef?.label ?? id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-6">
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
