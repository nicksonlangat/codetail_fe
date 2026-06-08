"use client";

import { PathBanner } from "@/components/dashboard/path-banner";
import { TodayChallenges } from "@/components/dashboard/today-challenges";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { StreakCompact } from "@/components/dashboard/streak-compact";
import { WeakAreas } from "@/components/dashboard/weak-areas";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { PremiumBanner } from "@/components/dashboard/premium-banner";

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">

      {/* Active path — always top */}
      <PathBanner />

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">

        {/* ── Left: work column ── */}
        <div className="space-y-8">
          <TodayChallenges />
          <ActivityTable />
        </div>

        {/* ── Right: context column ── */}
        <div className="space-y-8">

          {/* Streak */}
          <StreakCompact />

          <div className="h-px bg-border/50" />

          {/* Heatmap */}
          <HeatmapCard />

          <div className="h-px bg-border/50" />

          {/* Weak areas */}
          <WeakAreas />

          {/* Upgrade nudge (free only) */}
          <PremiumBanner />

        </div>
      </div>
    </main>
  );
}
