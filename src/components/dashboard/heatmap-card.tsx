"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

function intensityClass(level: number) {
  switch (level) {
    case 0:
      return "bg-secondary";
    case 1:
      return "bg-primary/25";
    case 2:
      return "bg-primary/50";
    case 3:
      return "bg-primary/80";
    default:
      return "bg-secondary";
  }
}

export function HeatmapCard() {
  const weeks = useMemo(() => {
    const data: number[][] = [];
    for (let w = 0; w < 12; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const base = w / 12;
        const rand = Math.random();
        if (rand < 0.3 - base * 0.15) week.push(0);
        else if (rand < 0.55) week.push(1);
        else if (rand < 0.8) week.push(2);
        else week.push(3);
      }
      data.push(week);
    }
    return data;
  }, []);

  const months = ["Jan", "Feb", "Mar"];
  const totalProblems = weeks.flat().reduce((s, v) => s + v, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Activity
            </span>
            <span className="text-[10px] text-muted-foreground/50">
              <span className="font-medium text-foreground tabular-nums">
                {totalProblems}
              </span>{" "}
              problems &middot; 12 weeks
            </span>
          </div>

          {/* Month labels */}
          <div className="flex items-center mb-1 ml-5">
            {months.map((m) => (
              <span
                key={m}
                className="text-[9px] text-muted-foreground/40"
                style={{ width: `${100 / 3}%` }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-0.5">
              {["", "M", "", "W", "", "F", ""].map((d, i) => (
                <span
                  key={i}
                  className="text-[8px] text-muted-foreground/40 h-[10px] flex items-center leading-none"
                >
                  {d}
                </span>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className={`w-[10px] h-[10px] rounded-[2px] ${intensityClass(level)}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-2.5 justify-end">
            <span className="text-[9px] text-muted-foreground/40">Less</span>
            {[0, 1, 2, 3].map((l) => (
              <div
                key={l}
                className={`w-[8px] h-[8px] rounded-[2px] ${intensityClass(l)}`}
              />
            ))}
            <span className="text-[9px] text-muted-foreground/40">More</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
