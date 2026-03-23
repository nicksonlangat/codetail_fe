"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

const COLORS = ["#14b8a6", "#22c55e", "#3b82f6", "#a855f7", "#f97316", "#eab308"];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  shape: "rect" | "circle";
  size: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 50),
    rotation: Math.random() * 720 - 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() > 0.5 ? "rect" : "circle",
    size: Math.random() * 6 + 4,
  }));
}

function makeSparkles(): Particle[] {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      id: i + 100,
      x: Math.cos(angle) * 60,
      y: Math.sin(angle) * 60 - 30,
      rotation: Math.random() * 360,
      color: "#14b8a6",
      shape: "circle" as const,
      size: 4,
    };
  });
}

export function ConfettiBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sparkles, setSparkles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const celebrate = useCallback(() => {
    setShowMessage(false);
    setParticles(makeParticles(30));
    setSparkles(makeSparkles());
    setTimeout(() => setShowMessage(true), 600);
  }, []);

  const reset = useCallback(() => {
    setParticles([]);
    setSparkles([]);
    setShowMessage(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main burst */}
      <div className="relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-12 overflow-hidden min-h-[260px]">
        {/* Confetti particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                width: p.size,
                height: p.shape === "rect" ? p.size * 1.5 : p.size,
                borderRadius: p.shape === "circle" ? "50%" : 2,
                backgroundColor: p.color,
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y + 120,
                rotate: p.rotation,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Achievement text */}
        <AnimatePresence>
          {showMessage && (
            <motion.p
              className="absolute top-6 text-sm font-semibold text-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={spring}
            >
              Achievement Unlocked!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 z-10">
          <motion.button
            onClick={celebrate}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            whileTap={{ scale: 0.95 }}
            transition={spring}
          >
            Celebrate!
          </motion.button>
          <motion.button
            onClick={reset}
            className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-500"
            whileTap={{ scale: 0.95 }}
            transition={spring}
          >
            Reset
          </motion.button>
        </div>
      </div>

      {/* Subtle sparkle variant */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Subtle Sparkle Variant
        </p>
        <div className="relative flex items-center justify-center rounded-xl border border-border/50 bg-card p-8 overflow-hidden min-h-[120px]">
          <AnimatePresence>
            {sparkles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  backgroundColor: p.color,
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0.8 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [0, 1.2, 0],
                  opacity: [0.8, 1, 0],
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
          <span className="text-xs text-muted-foreground z-10">
            {sparkles.length > 0 ? "Sparkle!" : "Click Celebrate above"}
          </span>
        </div>
      </div>
    </div>
  );
}
