"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import type { LeaderboardEntry } from "@/lib/api/leaderboard";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const MEDALS = ["🥇", "🥈", "🥉"];

const AVATAR_COLORS = [
  "bg-blue-400/20 text-blue-400",
  "bg-purple-400/20 text-purple-400",
  "bg-amber-400/20 text-amber-400",
  "bg-rose-400/20 text-rose-400",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ChangeIcon({ change }: { change: LeaderboardEntry["change"] }) {
  if (change === "up")   return <ArrowUp   className="w-2.5 h-2.5 text-emerald-400" />;
  if (change === "down") return <ArrowDown className="w-2.5 h-2.5 text-red-400" />;
  return <Minus className="w-2.5 h-2.5 text-muted-foreground/30" />;
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="w-5 h-3 rounded bg-muted animate-pulse" />
      <div className="w-6 h-6 rounded-full bg-muted animate-pulse shrink-0" />
      <div className="flex-1 h-3 rounded bg-muted animate-pulse" />
      <div className="w-8 h-3 rounded bg-muted animate-pulse" />
    </div>
  );
}

export function LeaderboardCard() {
  const { data, isLoading } = useLeaderboard();

  const entries = data?.entries ?? [];
  const yourRank = data?.your_rank ?? null;
  const topPercent = yourRank ? Math.round((yourRank / Math.max(entries.length, 1)) * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.06 }}
      className="rounded-xl bg-card/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          This week&apos;s top devs
        </span>
        <span className="text-[9px] text-muted-foreground/40 font-medium">Resets Monday</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/40">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
          : entries.length === 0
          ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[11px] text-muted-foreground/40">No activity this week yet.</p>
              <p className="text-[10px] text-muted-foreground/30 mt-1">Solve a problem to get on the board.</p>
            </div>
          )
          : entries.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.08 + i * 0.04 }}
              className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                entry.is_you
                  ? "bg-primary/5 hover:bg-primary/8"
                  : "hover:bg-muted/40"
              }`}
            >
              {/* Rank / medal */}
              <div className="w-5 shrink-0 text-center">
                {i < 3 ? (
                  <span className="text-[13px] leading-none">{MEDALS[i]}</span>
                ) : (
                  <span className="text-[10px] font-mono tabular-nums text-muted-foreground/40">{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${
                entry.is_you
                  ? "bg-primary text-primary-foreground"
                  : AVATAR_COLORS[i % AVATAR_COLORS.length]
              }`}>
                {entry.is_you ? "ME" : initials(entry.name)}
              </div>

              {/* Name */}
              <span className={`flex-1 text-[12px] font-medium truncate ${
                entry.is_you ? "text-primary" : "text-foreground"
              }`}>
                {entry.is_you ? "You" : entry.name}
              </span>

              {/* Change arrow */}
              <ChangeIcon change={entry.change} />

              {/* XP */}
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground/60 shrink-0">
                +{entry.xp_week}
              </span>
            </motion.div>
          ))
        }
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20">
        {isLoading ? (
          <div className="h-3 w-40 rounded bg-muted animate-pulse mx-auto" />
        ) : yourRank && topPercent !== null ? (
          <p className="text-[10px] text-muted-foreground/50 text-center">
            You&apos;re ranked{" "}
            <span className="font-semibold text-foreground">#{yourRank}</span>
            {topPercent <= 20 && (
              <> — top <span className="font-semibold text-foreground">{topPercent}%</span> this week</>
            )}
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground/40 text-center">
            Solve problems to climb the board
          </p>
        )}
      </div>
    </motion.div>
  );
}
