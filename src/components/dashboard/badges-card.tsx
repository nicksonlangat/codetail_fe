"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Target, BookOpen, Flame, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Badge {
  icon: LucideIcon;
  label: string;
  description: string;
  earned: boolean;
  color: string;
}

const badges: Badge[] = [
  {
    icon: Zap,
    label: "First Solve",
    description: "Complete your first problem",
    earned: true,
    color: "text-primary",
  },
  {
    icon: Flame,
    label: "Week Warrior",
    description: "7-day streak",
    earned: true,
    color: "text-orange-500",
  },
  {
    icon: Target,
    label: "Path Finder",
    description: "Finish a learning path",
    earned: true,
    color: "text-emerald-500",
  },
  {
    icon: BookOpen,
    label: "Deep Dive",
    description: "Solve 5 hard problems",
    earned: false,
    color: "text-blue-500",
  },
  {
    icon: Star,
    label: "Perfectionist",
    description: "All tests pass first try x10",
    earned: false,
    color: "text-orange-500",
  },
  {
    icon: Trophy,
    label: "Grand Master",
    description: "Complete all paths",
    earned: false,
    color: "text-primary",
  },
];

export function BadgesCard() {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Badges
            </span>
            <span className="text-[10px] text-muted-foreground/50">
              <span className="font-medium text-foreground tabular-nums">
                {earned}
              </span>
              /{badges.length} earned
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-colors duration-75 ${
                  badge.earned
                    ? "bg-card border-border hover:bg-secondary/40"
                    : "bg-muted/30 border-transparent opacity-40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    badge.earned ? "bg-secondary" : "bg-muted"
                  }`}
                >
                  <badge.icon
                    className={`w-3.5 h-3.5 ${
                      badge.earned ? badge.color : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-medium text-foreground block leading-tight">
                    {badge.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/50 leading-tight">
                    {badge.description}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
