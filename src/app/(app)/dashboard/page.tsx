"use client";

import { PathBanner } from "@/components/dashboard/path-banner";
import { TodayChallenges } from "@/components/dashboard/today-challenges";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { StreakCompact } from "@/components/dashboard/streak-compact";
import { WeakAreas } from "@/components/dashboard/weak-areas";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { PremiumBanner } from "@/components/dashboard/premium-banner";
import { RankCard } from "@/components/dashboard/rank-card";
import { BadgesCard } from "@/components/dashboard/badges-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">

      {/* Active path — always top */}
      <PathBanner />

      {/* ── Rank card — full width hero ────────────────────────────────── */}
      <RankCard />

      {/* ── Main body ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

        {/* ── Left: work column ── */}
        <div className="space-y-8">
          <TodayChallenges />
          <ActivityTable />
        </div>

        {/* ── Right: context column ── */}
        <div className="space-y-6">

          {/* Weak areas — first because it's the most actionable */}
          <WeakAreas />

          <div className="h-px bg-border/50" />

          {/* Weekly leaderboard */}
          <LeaderboardCard />

          <div className="h-px bg-border/50" />

          {/* Streak */}
          <StreakCompact />

          <div className="h-px bg-border/50" />

          {/* Activity heatmap */}
          <HeatmapCard />

          <div className="h-px bg-border/50" />

          {/* Badges */}
          <BadgesCard />

          {/* Upgrade nudge (free only) */}
          <PremiumBanner />

        </div>
      </div>
    </main>
  );
}
