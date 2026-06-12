"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Flame, Bug, Layers, CheckSquare, Map,
  Timer, Code2, Database, Trophy, Shield, Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRank } from "@/hooks/use-rank";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

interface BadgeDef {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bg: string;
  ring: string;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: "first-blood",
    icon: Zap,
    label: "First Blood",
    description: "Solved your first problem",
    color: "text-primary",
    bg: "bg-primary/15",
    ring: "ring-primary/30",
  },
  {
    id: "week-warrior",
    icon: Flame,
    label: "Week Warrior",
    description: "Maintained a 7-day streak",
    color: "text-orange-400",
    bg: "bg-orange-400/15",
    ring: "ring-orange-400/30",
  },
  {
    id: "debugger",
    icon: Bug,
    label: "Debugger",
    description: "Fixed 5 broken code problems",
    color: "text-red-400",
    bg: "bg-red-400/15",
    ring: "ring-red-400/30",
  },
  {
    id: "unit-clear",
    icon: CheckSquare,
    label: "Unit Clear",
    description: "Completed a full unit",
    color: "text-emerald-400",
    bg: "bg-emerald-400/15",
    ring: "ring-emerald-400/40",
  },
  {
    id: "pythonista",
    icon: Code2,
    label: "Pythonista",
    description: "Completed the Python path",
    color: "text-blue-400",
    bg: "bg-blue-400/15",
    ring: "ring-blue-400/30",
  },
  {
    id: "architect",
    icon: Layers,
    label: "Architect",
    description: "Submitted a refactor problem",
    color: "text-purple-400",
    bg: "bg-purple-400/15",
    ring: "ring-purple-400/30",
  },
  {
    id: "path-blazer",
    icon: Map,
    label: "Path Blazer",
    description: "Completed a full learning path",
    color: "text-amber-400",
    bg: "bg-amber-400/15",
    ring: "ring-amber-400/30",
  },
  {
    id: "speed-demon",
    icon: Timer,
    label: "Speed Demon",
    description: "Solved a problem in under 3 min",
    color: "text-sky-400",
    bg: "bg-sky-400/15",
    ring: "ring-sky-400/30",
  },
  {
    id: "django-dev",
    icon: Database,
    label: "Django Dev",
    description: "Completed the Django path",
    color: "text-emerald-400",
    bg: "bg-emerald-400/15",
    ring: "ring-emerald-400/30",
  },
  {
    id: "the-50",
    icon: Trophy,
    label: "The 50",
    description: "Solved 50 total problems",
    color: "text-amber-400",
    bg: "bg-amber-400/15",
    ring: "ring-amber-400/30",
  },
  {
    id: "hard-mode",
    icon: Shield,
    label: "Hard Mode",
    description: "Solved 5 hard-difficulty problems",
    color: "text-rose-400",
    bg: "bg-rose-400/15",
    ring: "ring-rose-400/30",
  },
  {
    id: "night-owl",
    icon: Moon,
    label: "Night Owl",
    description: "Solved a problem after midnight",
    color: "text-slate-400",
    bg: "bg-slate-400/15",
    ring: "ring-slate-400/30",
  },
];

function BadgeSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-2 w-8 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function BadgesCard() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { data, isLoading } = useRank();

  const earnedSet = new Set(data?.badges ?? []);
  const earnedCount = earnedSet.size;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Badges
        </span>
        <span className="text-[10px] text-muted-foreground/50">
          <span className="font-semibold text-foreground tabular-nums">
            {isLoading ? "–" : earnedCount}
          </span>
          <span className="text-muted-foreground/30"> / {BADGE_DEFS.length}</span>
        </span>
      </div>

      {isLoading ? (
        <BadgeSkeleton />
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {BADGE_DEFS.map((badge, i) => {
            const Icon = badge.icon;
            const earned = earnedSet.has(badge.id);
            const isHovered = hovered === badge.id;

            return (
              <div
                key={badge.id}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHovered(badge.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...spring, delay: 0.04 + i * 0.03 }}
                  className={`flex flex-col items-center gap-1.5 ${!earned && "opacity-30"}`}
                >
                  <div className={`
                    relative w-10 h-10 rounded-md flex items-center justify-center
                    transition-all duration-200 cursor-pointer
                    ${earned ? badge.bg : "bg-muted"}
                    ${earned && isHovered ? `ring-2 ${badge.ring}` : ""}
                  `}>
                    <Icon className={`w-4.5 h-4.5 ${earned ? badge.color : "text-muted-foreground/40"}`} />
                  </div>

                  <span className={`text-[8px] font-medium text-center leading-tight w-full truncate ${
                    earned ? "text-foreground/80" : "text-muted-foreground/30"
                  }`}>
                    {badge.label}
                  </span>
                </motion.div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.92 }}
                      transition={spring}
                      className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-36 px-3 py-2.5 rounded-lg bg-foreground text-background shadow-xl pointer-events-none"
                    >
                      <p className="font-semibold text-[10px] leading-tight mb-1">{badge.label}</p>
                      <p className="text-[9px] opacity-60 leading-relaxed">{badge.description}</p>
                      {earned ? (
                        <p className="mt-1.5 text-[9px] text-emerald-400 font-semibold">✓ Earned</p>
                      ) : (
                        <p className="mt-1.5 text-[9px] opacity-40 font-medium">Not yet unlocked</p>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
