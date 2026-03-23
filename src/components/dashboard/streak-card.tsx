"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const currentStreak = 12;
const longestStreak = 21;
const todayDone = true;

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const weekActivity = [true, true, true, false, true, true, true];

export function StreakCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Streak
            </span>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center ${
                todayDone ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <Flame
                className={`w-3 h-3 ${
                  todayDone ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl font-bold tabular-nums font-mono text-foreground">
              {currentStreak}
            </span>
            <span className="text-[11px] text-muted-foreground">days</span>
          </div>

          {/* Week dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-md ${
                    weekActivity[i] ? "bg-primary/80" : "bg-secondary"
                  }`}
                />
                <span className="text-[9px] text-muted-foreground/50">
                  {day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <TrendingUp className="w-3 h-3" />
            <span>
              Best:{" "}
              <span className="font-medium text-foreground tabular-nums">
                {longestStreak} days
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
