"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const COLORS = ["#14b8a6", "#22c55e", "#3b82f6", "#a855f7", "#f97316", "#eab308"];

export function CelebrationCTA() {
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; r: number; color: string; shape: "rect" | "circle"; size: number }[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);

  const celebrate = useCallback(() => {
    setShowAchievement(false);
    setConfetti(Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 280,
      y: -(Math.random() * 180 + 40),
      r: Math.random() * 720 - 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? "rect" : "circle",
      size: Math.random() * 6 + 4,
    })));
    setTimeout(() => setShowAchievement(true), 500);
    setTimeout(() => { setConfetti([]); setShowAchievement(false); }, 3000);
  }, []);

  return (
    <section className="py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ ...spring, delay: 0.2 }}
        className="max-w-[640px] mx-auto rounded-xl border border-border bg-card relative overflow-hidden flex items-center justify-center min-h-[200px]"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(164_70%_40%/0.06),transparent_70%)] pointer-events-none" />

        {/* Confetti particles */}
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.div key={p.id}
              className="absolute pointer-events-none"
              style={{
                width: p.size,
                height: p.shape === "rect" ? p.size * 1.5 : p.size,
                borderRadius: p.shape === "circle" ? "50%" : 2,
                backgroundColor: p.color,
                left: "50%", top: "50%",
              }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: p.x, y: p.y + 100, rotate: p.r, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Achievement text */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-[13px] font-semibold text-primary">First step taken!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 text-center py-8">
          <h3 className="text-[24px] font-bold mb-2 tracking-tight">
            Your journey starts with one click.
          </h3>
          <p className="text-[15px] text-muted-foreground mb-6 max-w-md mx-auto">
            50+ curated challenges. AI that reviews every line. Progress you can see.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl cursor-pointer shadow-[0_2px_24px_-4px_hsl(164_70%_40%/0.3)]">
                Start free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button onClick={celebrate}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-muted-foreground hover:text-foreground px-5 py-3 rounded-xl border border-border hover:border-muted-foreground/30 cursor-pointer transition-colors duration-500">
              <Trophy className="w-4 h-4 text-primary" />
              Celebrate
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
