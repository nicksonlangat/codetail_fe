"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "47", label: "solved" },
  { value: "4", label: "active paths" },
  { value: "3", label: "completed" },
  { value: "6", label: "paths unlocked" },
];

export function ProgressSummary() {
  return (
    <div className="flex items-center gap-5">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-baseline gap-1.5"
        >
          <span className="text-[13px] font-semibold text-foreground tabular-nums font-mono">
            {s.value}
          </span>
          <span className="text-[10px] text-muted-foreground/60">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
