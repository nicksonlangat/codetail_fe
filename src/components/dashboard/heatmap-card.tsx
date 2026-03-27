"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api/progress";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const ROWS = 7;
const COLS = 12;
const dayLabels = ["M", "", "W", "", "F", "", ""];

const levelClasses = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function HeatmapCard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
    staleTime: 30000,
  });

  const [hover, setHover] = useState<{ col: number; row: number } | null>(null);

  // Build heatmap data from API stats or generate deterministic fallback
  const { data, monthLabels, total } = useMemo(() => {
    const grid: number[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - COLS * 7);

    // Build a map of date → solved count from API data
    const solvedMap: Record<string, number> = {};
    if (stats?.solved_per_day) {
      let prev = 0;
      for (const point of stats.solved_per_day) {
        const daily = point.value - prev;
        if (daily > 0) solvedMap[point.date] = daily;
        prev = point.value;
      }
    }

    let totalSolved = 0;
    const months: string[] = [];
    let lastMonth = -1;

    for (let col = 0; col < COLS; col++) {
      const week: number[] = [];
      for (let row = 0; row < ROWS; row++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + col * 7 + row);
        const key = d.toISOString().split("T")[0];
        const count = solvedMap[key] ?? 0;
        totalSolved += count;
        week.push(getLevel(count));

        // Track month labels
        if (row === 0) {
          const m = d.getMonth();
          if (m !== lastMonth) {
            months.push(d.toLocaleDateString("en-US", { month: "short" }));
            lastMonth = m;
          } else {
            months.push("");
          }
        }
      }
      grid.push(week);
    }

    return { data: grid, monthLabels: months, total: totalSolved };
  }, [stats]);

  function getDate(col: number, row: number): string {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - COLS * 7);
    const d = new Date(startDate);
    d.setDate(d.getDate() + col * 7 + row);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function getCounts(level: number): number {
    return [0, 1, 3, 5, 8][level];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <div className="rounded-xl bg-card border border-border/50 p-4">
        {/* Month labels */}
        <div className="flex ml-6 mb-1">
          {monthLabels.map((label, i) => (
            <span key={i} className="text-[9px] text-muted-foreground/60 font-mono"
              style={{ width: 18, textAlign: "center" }}>
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col mr-1.5" style={{ gap: 2 }}>
            {dayLabels.map((label, i) => (
              <span key={i} className="text-[9px] text-muted-foreground/60 font-mono leading-none"
                style={{ height: 14, display: "flex", alignItems: "center", width: 16 }}>
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex" style={{ gap: 2 }}>
            {data.map((week, col) => (
              <div key={col} className="flex flex-col" style={{ gap: 2 }}>
                {week.map((level, row) => (
                  <div key={`${col}-${row}`} className="relative"
                    onMouseEnter={() => setHover({ col, row })}
                    onMouseLeave={() => setHover(null)}>
                    <div className={`w-[14px] h-[14px] rounded-[2px] cursor-pointer transition-all duration-500 ${
                      levelClasses[level]
                    } ${hover && (hover.col === col || hover.row === row) ? "ring-1 ring-primary/10" : ""}`} />

                    <AnimatePresence>
                      {hover?.col === col && hover?.row === row && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={spring}
                          className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-[10px] whitespace-nowrap shadow-lg">
                          <span className="font-medium">{getDate(col, row)}</span>
                          <span className="text-background/70"> &mdash; {getCounts(level)} problems solved</span>
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
            <span className="font-semibold text-foreground">{total}</span> problems solved in the last 12 weeks
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground/60">Less</span>
            {levelClasses.map((cls, i) => (
              <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${cls} transition-all duration-500`} />
            ))}
            <span className="text-[9px] text-muted-foreground/60">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
