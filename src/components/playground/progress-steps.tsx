"use client";

import { useState, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";

const springConfig = { stiffness: 400, damping: 25 };

const milestones = [
  { pct: 0, label: "Beginner" },
  { pct: 25, label: "Intermediate" },
  { pct: 50, label: "Advanced" },
  { pct: 75, label: "Expert" },
  { pct: 100, label: "Master" },
];

const MAX_XP = 5000;

function formatXP(val: number): string {
  return Math.round(val).toLocaleString();
}

function AnimatedXP({ xp }: { xp: number }) {
  const springVal = useSpring(xp, springConfig);
  const display = useTransform(springVal, (v) => formatXP(v));

  return (
    <motion.span className="text-sm font-bold text-foreground tabular-nums font-mono">
      {display}
    </motion.span>
  );
}

export function ProgressSteps() {
  const [progress, setProgress] = useState(62);
  const [hovering, setHovering] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const xp = Math.round((progress / 100) * MAX_XP);

  const adjust = useCallback((delta: number) => {
    setProgress((p) => Math.max(0, Math.min(100, p + delta)));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBarWidth(rect.width);
    setHoverX(e.clientX - rect.left);
  };

  const hoverPct = barWidth > 0 ? Math.round((hoverX / barWidth) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar area */}
      <div className="pt-2 pb-8">
        <div
          className="relative h-2 bg-muted rounded-full cursor-pointer"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (barWidth > 0) setProgress(Math.round((hoverX / barWidth) * 100));
          }}
        >
          {/* Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", ...springConfig }}
          />

          {/* Glow at current position */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/30"
            initial={false}
            animate={{
              left: `${progress}%`,
              x: "-50%",
              scale: [1, 1.4, 1],
            }}
            transition={{
              left: { type: "spring", ...springConfig },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            }}
          />

          {/* Hover badge */}
          {hovering && (
            <motion.div
              className="absolute -top-8 pointer-events-none"
              style={{ left: hoverX }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="bg-foreground text-background text-[10px] font-mono font-medium px-1.5 py-0.5 rounded">
                {hoverPct}%
              </div>
            </motion.div>
          )}

          {/* Milestone markers */}
          {milestones.map((m) => {
            const passed = progress >= m.pct;
            const isCurrent =
              progress >= m.pct &&
              (m.pct === 100 || progress < (milestones[milestones.indexOf(m) + 1]?.pct ?? 101));

            return (
              <div
                key={m.pct}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${m.pct}%`, transform: `translateX(-50%) translateY(-50%)` }}
              >
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    passed
                      ? "bg-primary border-primary"
                      : "bg-background border-muted-foreground/30"
                  }`}
                  animate={isCurrent ? { boxShadow: "0 0 0 4px rgba(20,184,166,0.2)" } : { boxShadow: "0 0 0 0px rgba(20,184,166,0)" }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  {passed && <Check className="w-2.5 h-2.5 text-white" />}
                </motion.div>
                <p
                  className={`absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-medium whitespace-nowrap transition-all duration-500 ${
                    passed ? "text-primary" : "text-muted-foreground/50"
                  }`}
                >
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP display */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border/50 px-4 py-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
            Experience Points
          </p>
          <div className="flex items-baseline gap-1">
            <AnimatedXP xp={xp} />
            <span className="text-[11px] text-muted-foreground">/ {formatXP(MAX_XP)} XP</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            whileTap={{ scale: 0.93 }}
            onClick={() => adjust(-10)}
          >
            <Minus className="w-3 h-3" />
          </motion.button>

          <div className="w-16 text-center">
            <motion.span
              className="text-[13px] font-bold text-primary tabular-nums font-mono"
              key={progress}
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", ...springConfig }}
            >
              {progress}%
            </motion.span>
          </div>

          <motion.button
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            whileTap={{ scale: 0.93 }}
            onClick={() => adjust(10)}
          >
            <Plus className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
