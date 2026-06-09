"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api/progress";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const levelClasses = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function HeatmapCard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
    staleTime: 30000,
  });

  const now = new Date();
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [tooltip, setTooltip] = useState<{ day: number; count: number; x: number; y: number } | null>(null);

  const isCurrentMonth = isSameMonth(cursor, now);

  function prevMonth() {
    setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    if (!isCurrentMonth) setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // Build solved-per-day map
  const solvedMap = useMemo<Record<string, number>>(() => {
    if (!stats?.solved_per_day) return {};
    const map: Record<string, number> = {};
    let prev = 0;
    for (const point of stats.solved_per_day) {
      const daily = point.value - prev;
      if (daily > 0) map[point.date] = daily;
      prev = point.value;
    }
    return map;
  }, [stats]);

  // Build calendar grid for the current cursor month
  const { weeks, monthTotal } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
    const startOffset = firstDow === 0 ? 6 : firstDow - 1; // Mon=0

    let total = 0;
    const cells: ({ day: number; level: number; count: number } | null)[] = [
      ...Array(startOffset).fill(null),
    ];

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const count = solvedMap[key] ?? 0;
      total += count;
      cells.push({ day: d, level: getLevel(count), count });
    }

    // Pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null);

    const w: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));

    return { weeks: w, monthTotal: total };
  }, [cursor, solvedMap]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-3">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Activity
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-secondary cursor-pointer transition-colors duration-150 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-medium text-foreground w-28 text-center tabular-nums">
            {monthLabel}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-secondary cursor-pointer transition-colors duration-150 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-[9px] text-muted-foreground/40 text-center font-medium">{d}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${cursor.getFullYear()}-${cursor.getMonth()}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={spring}
          className="space-y-1"
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((cell, di) => {
                if (!cell) return <div key={di} />;
                const isToday = isCurrentMonth && cell.day === now.getDate();
                return (
                  <div
                    key={di}
                    className="relative group"
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ day: cell.day, count: cell.count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className={`
                      w-full aspect-square rounded flex items-center justify-center
                      text-[9px] font-mono cursor-default transition-all duration-200
                      ${levelClasses[cell.level]}
                      ${isToday ? "ring-1 ring-primary ring-offset-1 ring-offset-background" : ""}
                      ${cell.count > 0 ? "text-primary-foreground/80" : "text-muted-foreground/50"}
                      hover:ring-1 hover:ring-primary/30
                    `}>
                      {cell.day}
                    </div>
                    {/* Tooltip */}
                    <AnimatePresence>
                      {tooltip?.day === cell.day && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={spring}
                          className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded bg-foreground text-background text-[9px] whitespace-nowrap shadow-lg pointer-events-none"
                        >
                          {cell.count} solved
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-muted-foreground/50">
          <span className="font-semibold text-foreground tabular-nums">{monthTotal}</span> solved this month
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-muted-foreground/40">Less</span>
          {levelClasses.map((cls, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
          ))}
          <span className="text-[9px] text-muted-foreground/40">More</span>
        </div>
      </div>
    </div>
  );
}
