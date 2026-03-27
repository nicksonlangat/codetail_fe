"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Flame, TrendingUp, Snowflake } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStreak } from "@/lib/api/progress";

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard() {
  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
    staleTime: 60000,
  });

  const [hovered, setHovered] = useState(false);
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;

  // Build week activity from current streak
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1; // Convert to Mon=0
  const weekActivity = WEEK_LABELS.map((_, i) => {
    if (i <= todayIdx) return i >= todayIdx - Math.min(currentStreak - 1, todayIdx);
    return false;
  });

  /* Animated streak number */
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    const t = setTimeout(() => raw.set(currentStreak), 300);
    return () => clearTimeout(t);
  }, [raw, currentStreak]);

  return (
    <motion.div
      className="relative rounded-xl bg-card border border-border p-6 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Warm gradient on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(164 70% 40% / 0.06), transparent 70%)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Flame + number */}
      <div className="relative flex items-center gap-4 mb-5">
        <motion.div
          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flame className="w-6 h-6 text-primary" />
        </motion.div>

        <div>
          <div className="flex items-baseline gap-1">
            <motion.span className="text-3xl font-bold tabular-nums font-mono text-foreground">
              {display}
            </motion.span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
            Current Streak
          </span>
        </div>
      </div>

      {/* Week dots */}
      <div className="relative flex items-center justify-between mb-4">
        {WEEK_LABELS.map((d, i) => {
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-medium ${
                  weekActivity[i]
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
                {...(isToday
                  ? {
                      animate: {
                        boxShadow: [
                          "0 0 0 0px hsl(164 70% 40% / 0.3)",
                          "0 0 0 4px hsl(164 70% 40% / 0)",
                        ],
                      },
                      transition: { repeat: Infinity, duration: 1.5, ease: "easeOut" },
                    }
                  : {})}
              />
              <span className="text-[9px] text-muted-foreground/50">{d}</span>
            </div>
          );
        })}
      </div>

      {/* Longest streak */}
      <div className="relative flex items-center gap-1 text-[10px] text-muted-foreground/60">
        <TrendingUp className="w-3 h-3" />
        <span>
          Longest: <span className="font-medium text-foreground tabular-nums">{longestStreak} days</span>
        </span>
      </div>

      {/* Freeze badge */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-info/10 border border-info/20 px-2 py-0.5 text-[10px] font-medium text-info"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Snowflake className="w-3 h-3" />
            1 freeze left
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
