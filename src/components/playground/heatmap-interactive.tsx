"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const ROWS = 7;
const COLS = 12;
const dayLabels = ["M", "", "W", "", "F", "", ""];
const monthLabels = ["Jan", "", "", "Feb", "", "", "Mar", "", "", "Apr", "", ""];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateData() {
  const data: number[][] = [];
  for (let col = 0; col < COLS; col++) {
    const week: number[] = [];
    for (let row = 0; row < ROWS; row++) {
      const r = seededRandom(col * 7 + row + 42);
      if (r < 0.3) week.push(0);
      else if (r < 0.55) week.push(1);
      else if (r < 0.75) week.push(2);
      else if (r < 0.9) week.push(3);
      else week.push(4);
    }
    data.push(week);
  }
  return data;
}

function getDate(col: number, row: number): string {
  const start = new Date(2026, 0, 5);
  const d = new Date(start);
  d.setDate(d.getDate() + col * 7 + row);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getCounts(level: number): number {
  return [0, 1, 3, 5, 8][level];
}

const levelClasses = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
];

export function HeatmapInteractive() {
  const data = useMemo(generateData, []);
  const [hover, setHover] = useState<{ col: number; row: number } | null>(null);

  const total = useMemo(() => {
    return data.reduce(
      (sum, week) =>
        sum + week.reduce((s, level) => s + getCounts(level), 0),
      0
    );
  }, [data]);

  return (
    <div className="py-4">
      <div className="rounded-xl bg-card border border-border/50 p-4">
        {/* Month labels */}
        <div className="flex ml-6 mb-1">
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="text-[9px] text-muted-foreground/60 font-mono"
              style={{ width: 18, textAlign: "center" }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col mr-1.5" style={{ gap: 2 }}>
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className="text-[9px] text-muted-foreground/60 font-mono leading-none"
                style={{ height: 14, display: "flex", alignItems: "center", width: 16 }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex" style={{ gap: 2 }}>
            {data.map((week, col) => (
              <div key={col} className="flex flex-col" style={{ gap: 2 }}>
                {week.map((level, row) => (
                  <div
                    key={`${col}-${row}`}
                    className="relative"
                    onMouseEnter={() => setHover({ col, row })}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div
                      className={`w-[14px] h-[14px] rounded-[2px] cursor-pointer transition-all duration-500 ${
                        levelClasses[level]
                      } ${
                        hover && (hover.col === col || hover.row === row)
                          ? "ring-1 ring-primary/10"
                          : ""
                      }`}
                    />

                    <AnimatePresence>
                      {hover?.col === col && hover?.row === row && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={spring}
                          className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-[10px] whitespace-nowrap shadow-lg"
                        >
                          <span className="font-medium">{getDate(col, row)}</span>
                          <span className="text-background/70">
                            {" "}&mdash; {getCounts(level)} problems solved
                          </span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <span className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span> problems
            solved in the last 12 weeks
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground/60">Less</span>
            {levelClasses.map((cls, i) => (
              <div
                key={i}
                className={`w-[12px] h-[12px] rounded-[2px] ${cls} transition-all duration-500`}
              />
            ))}
            <span className="text-[9px] text-muted-foreground/60">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
