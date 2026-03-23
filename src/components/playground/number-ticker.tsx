"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface MetricConfig {
  key: string;
  value: number;
  label: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
}

const initialMetrics: MetricConfig[] = [
  {
    key: "solved",
    value: 1247,
    label: "Problems Solved",
    min: 0,
    max: 9999,
    step: 1,
    format: (n: number) => n.toLocaleString(),
  },
  {
    key: "accuracy",
    value: 89,
    label: "Accuracy",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    format: (n: number) => String(n),
  },
  {
    key: "streak",
    value: 42,
    label: "Day Streak",
    min: 0,
    max: 999,
    step: 1,
    format: (n: number) => String(n),
  },
];

function Digit({ char, id }: { char: string; id: string }) {
  return (
    <div className="relative w-7 h-10 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={spring}
          className="absolute font-mono text-3xl font-bold tabular-nums text-foreground"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function FormattedNumber({
  value,
  format,
  suffix,
}: {
  value: number;
  format: (n: number) => string;
  suffix?: string;
}) {
  const formatted = format(value);
  const chars = formatted.split("");

  return (
    <div className="flex items-center justify-center">
      {chars.map((char, i) => {
        if (char === ",") {
          return (
            <span
              key={`sep-${i}`}
              className="font-mono text-3xl font-bold tabular-nums text-muted-foreground"
            >
              ,
            </span>
          );
        }
        return (
          <Digit key={`pos-${i}`} char={char} id={`${char}-${value}-${i}`} />
        );
      })}
      {suffix && (
        <span className="font-mono text-3xl font-bold tabular-nums text-muted-foreground ml-0.5">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function NumberTicker() {
  const [metrics, setMetrics] = useState(initialMetrics);

  const update = (key: string, delta: number) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.key === key
          ? { ...m, value: Math.min(m.max, Math.max(m.min, m.value + delta * m.step)) }
          : m
      )
    );
  };

  return (
    <div className="py-6">
      <div className="flex flex-wrap justify-center gap-8">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="flex flex-col items-center gap-3 rounded-xl bg-card border border-border/50 px-6 py-5"
          >
            <FormattedNumber
              value={metric.value}
              format={metric.format}
              suffix={metric.suffix}
            />
            <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
              {metric.label}
            </span>
            <div className="flex gap-1.5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                onClick={() => update(metric.key, -1)}
                className="cursor-pointer w-7 h-7 rounded-md bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center transition-all duration-500 hover:text-foreground"
              >
                -
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                onClick={() => update(metric.key, 1)}
                className="cursor-pointer w-7 h-7 rounded-md bg-primary text-white text-xs font-medium flex items-center justify-center transition-all duration-500"
              >
                +
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
