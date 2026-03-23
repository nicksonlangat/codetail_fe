"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface MeterConfig {
  difficulty: Difficulty;
  segments: number;
  color: string;
  bgColor: string;
}

const meters: MeterConfig[] = [
  { difficulty: "Easy", segments: 2, color: "bg-green-500", bgColor: "bg-green-500/20" },
  { difficulty: "Medium", segments: 3, color: "bg-yellow-500", bgColor: "bg-yellow-500/20" },
  { difficulty: "Hard", segments: 5, color: "bg-red-500", bgColor: "bg-red-500/20" },
];

const barColors: Record<Difficulty, string> = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
};

interface DistItem {
  difficulty: Difficulty;
  count: number;
  max: number;
}

const distribution: DistItem[] = [
  { difficulty: "Easy", count: 45, max: 45 },
  { difficulty: "Medium", count: 38, max: 45 },
  { difficulty: "Hard", count: 12, max: 45 },
];

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

function Segment({ filled, color, bgColor, delay }: { filled: boolean; color: string; bgColor: string; delay: number }) {
  return (
    <div className={`h-3 flex-1 rounded-sm ${bgColor}`}>
      {filled && (
        <motion.div
          className={`h-full w-full rounded-sm ${color}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...spring, delay }}
          style={{ originX: 0 }}
        />
      )}
    </div>
  );
}

function Meter({ config, index }: { config: MeterConfig; index: number }) {
  const totalSegments = 5;
  const baseDelay = index * 0.2;

  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: baseDelay }}
    >
      <div className="flex gap-1">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <Segment
            key={i}
            filled={i < config.segments}
            color={config.color}
            bgColor={i < config.segments ? config.bgColor : "bg-muted"}
            delay={baseDelay + i * 0.06}
          />
        ))}
      </div>
      <motion.p
        className="text-[11px] font-medium text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 0.3, duration: 0.2 }}
      >
        {config.difficulty}
      </motion.p>
    </motion.div>
  );
}

function AnimatedCount({ target, delay }: { target: number; delay: number }) {
  const [started, setStarted] = useState(false);
  const springVal = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(springVal, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      springVal.set(target);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [springVal, target, delay]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setDisplayVal(v));
    return unsub;
  }, [display]);

  return <span className="text-[11px] font-mono tabular-nums text-foreground">{started ? displayVal : 0}</span>;
}

function DistributionBar({ item, index }: { item: DistItem; index: number }) {
  const widthPercent = (item.count / item.max) * 100;
  const delay = 0.6 + index * 0.15;

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring, delay }}
    >
      <span className="text-[11px] text-muted-foreground w-14 text-right">{item.difficulty}</span>
      <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
        <motion.div
          className={`h-full ${barColors[item.difficulty]} rounded-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercent}%` }}
          transition={{ ...spring, delay: delay + 0.1 }}
        />
      </div>
      <AnimatedCount target={item.count} delay={delay + 0.1} />
    </motion.div>
  );
}

export function DifficultyMeter() {
  return (
    <div className="space-y-6">
      {/* Meters */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Difficulty Levels
        </p>
        <div className="grid grid-cols-3 gap-4">
          {meters.map((m, i) => (
            <Meter key={m.difficulty} config={m} index={i} />
          ))}
        </div>
      </div>

      {/* Distribution chart */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Problem Distribution
        </p>
        <div className="space-y-1.5">
          {distribution.map((item, i) => (
            <DistributionBar key={item.difficulty} item={item} index={i} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/40 text-right tabular-nums">
          95 total problems
        </p>
      </div>
    </div>
  );
}
