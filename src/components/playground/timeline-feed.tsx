"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Play,
  Flame,
  Unlock,
  Bot,
  Award,
  ArrowRight,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const entries = [
  {
    type: "solved",
    dot: "bg-green-500",
    icon: CheckCircle2,
    title: "Solved Two Sum in 8 minutes",
    description: "Used hash map approach for O(n) time complexity.",
    time: "2m ago",
  },
  {
    type: "started",
    dot: "bg-primary",
    icon: Play,
    title: "Started Sliding Window path",
    description: "Beginning the sliding window technique learning path.",
    time: "1h ago",
  },
  {
    type: "streak",
    dot: "bg-orange-500",
    icon: Flame,
    title: "7-day streak achieved!",
    description: "Consistent practice pays off. Keep it going!",
    time: "3h ago",
  },
  {
    type: "unlocked",
    dot: "bg-purple-500",
    icon: Unlock,
    title: "Unlocked Dynamic Programming",
    description: "New category available after mastering recursion basics.",
    time: "Yesterday",
  },
  {
    type: "reviewed",
    dot: "bg-blue-500",
    icon: Bot,
    title: "AI reviewed your solution",
    description: "Suggested optimization: use memoization to reduce calls.",
    time: "2d ago",
  },
  {
    type: "badge",
    dot: "bg-yellow-500",
    icon: Award,
    title: "Earned 'Speed Demon' badge",
    description: "Solved 5 easy problems in under 10 minutes each.",
    time: "1w ago",
  },
];

export function TimelineFeed() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="py-6 relative">
      {/* Timeline line */}
      <motion.div
        className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-border/40 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ ...spring, delay: 0.2 }}
      />

      <div className="space-y-0">
        {entries.map((entry, i) => {
          const Icon = entry.icon;
          const isHovered = hoveredIdx === i;
          return (
            <motion.div
              key={entry.type}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.15 + i * 0.08 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex gap-3 cursor-pointer group py-3"
            >
              {/* Dot */}
              <motion.div
                animate={{ scale: isHovered ? 1.3 : 1 }}
                transition={spring}
                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 ${entry.dot}/15 transition-all duration-500`}
              >
                <div
                  className={`w-[8px] h-[8px] rounded-full ${entry.dot} transition-all duration-500`}
                />
              </motion.div>

              {/* Content */}
              <motion.div
                animate={{ y: isHovered ? -2 : 0 }}
                transition={spring}
                className="flex-1 min-w-0 pb-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-[12px] font-semibold text-foreground tracking-tight truncate">
                    {entry.title}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {entry.description}
                </p>

                {/* View details link */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    height: isHovered ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-primary font-medium mt-1 cursor-pointer">
                    View details
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </motion.div>
              </motion.div>

              {/* Timestamp */}
              <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums flex-shrink-0 pt-0.5">
                {entry.time}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
