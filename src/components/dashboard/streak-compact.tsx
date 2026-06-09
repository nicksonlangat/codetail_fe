"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getStreak } from "@/lib/api/progress";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCompact() {
  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
    staleTime: 60000,
  });

  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    const t = setTimeout(() => raw.set(current), 200);
    return () => clearTimeout(t);
  }, [raw, current]);

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const weekActive = DAYS.map((_, i) =>
    i <= todayIdx && i >= todayIdx - Math.min(current - 1, todayIdx)
  );

  return (
    <div className="space-y-3">
      {/* Number */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <motion.span className="text-[36px] font-bold font-mono tabular-nums text-foreground leading-none">
            {display}
          </motion.span>
          <span className="text-[12px] text-muted-foreground">day streak</span>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-0.5 font-medium uppercase tracking-widest">
          Longest: {longest} days
        </p>
      </div>

      {/* Week grid */}
      <div className="flex items-center gap-1.5">
        {DAYS.map((d, i) => {
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-semibold transition-colors duration-300 ${
                  weekActive[i]
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground/40"
                }`}
                {...(isToday && current > 0 ? {
                  animate: { boxShadow: ["0 0 0 0px hsl(164 70% 40% / 0.4)", "0 0 0 3px hsl(164 70% 40% / 0)"] },
                  transition: { repeat: Infinity, duration: 1.8, ease: "easeOut" },
                } : {})}
              />
              <span className="text-[8px] text-muted-foreground/40">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
