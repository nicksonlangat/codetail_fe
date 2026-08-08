"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActivity } from "@/lib/api/auth";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const LEVEL_BG = [
  "bg-brand-surface",
  "bg-brand-primary/20",
  "bg-brand-primary/40",
  "bg-brand-primary/65",
  "bg-brand-primary",
];
const CALENDAR_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function HeatmapCard() {
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [tooltip, setTooltip] = useState<string | null>(null);

  const isCurrentMonth =
    cursor.getFullYear() === now.getFullYear() && cursor.getMonth() === now.getMonth();

  const { data: activityData = {} } = useQuery({
    queryKey: ["activity", cursor.getFullYear(), cursor.getMonth() + 1],
    queryFn: () => getActivity(cursor.getFullYear(), cursor.getMonth() + 1),
    staleTime: 60_000,
  });

  function prevMonth() {
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    if (!isCurrentMonth) setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const { weeks, monthTotal } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay();
    const startOffset = firstDow === 0 ? 6 : firstDow - 1;

    let total = 0;
    const cells: ({ day: number; level: number; count: number } | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const isFuture = isCurrentMonth && d > now.getDate();
      const count = isFuture ? 0 : (activityData[d] ?? 0);
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
      total += count;
      cells.push({ day: d, level, count });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const w: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    return { weeks: w, monthTotal: total };
  }, [cursor, isCurrentMonth, now, activityData]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="border border-brand-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-brand-text">Activity</h3>
        <div className="flex items-center gap-0.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="size-5 flex items-center justify-center rounded-md hover:bg-brand-surface cursor-pointer transition-all duration-500 text-brand-text-muted"
          >
            <ChevronLeft className="size-3" />
          </motion.button>
          <span className="text-[10px] font-medium w-14 text-center tabular-nums text-brand-text">
            {monthLabel}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="size-5 flex items-center justify-center rounded-md hover:bg-brand-surface cursor-pointer transition-all duration-500 text-brand-text-muted disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="size-3" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {CALENDAR_DAYS.map((d, i) => (
          <span key={i} className="text-[8px] text-brand-text-subtle text-center font-medium">
            {d[0]}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${cursor.getFullYear()}-${cursor.getMonth()}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={SP}
          className="space-y-1"
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((cell, di) => {
                if (!cell) return <div key={di} />;
                const cellKey = `${wi}-${di}`;
                const isToday = isCurrentMonth && cell.day === now.getDate();
                return (
                  <div
                    key={di}
                    className="relative"
                    onMouseEnter={() => setTooltip(cellKey)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div
                      className={`aspect-square rounded-sm flex items-center justify-center text-[8px] font-mono cursor-default transition-all duration-500 ${LEVEL_BG[cell.level]} ${
                        cell.level >= 3 ? "text-white" : "text-brand-text-muted"
                      } ${isToday ? "ring-1 ring-brand-primary ring-offset-1" : ""}`}
                    >
                      {cell.day}
                    </div>
                    <AnimatePresence>
                      {tooltip === cellKey && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={SP}
                          className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-brand-text text-white text-[10px] whitespace-nowrap pointer-events-none"
                        >
                          {cell.count} solved
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

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
        <span className="text-[10px] text-brand-text-muted">
          <span className="font-semibold text-brand-text">{monthTotal}</span> solved
        </span>
        <div className="flex items-center gap-0.5">
          {LEVEL_BG.map((cls, i) => (
            <div key={i} className={`size-2 rounded-sm ${cls}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
