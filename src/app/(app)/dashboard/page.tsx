"use client";

import { motion } from "framer-motion";
import { SparklineStats } from "@/components/dashboard/sparkline-stats";
import { AiInsight } from "@/components/dashboard/ai-insight";
import { StreakCard } from "@/components/dashboard/streak-card";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { BadgesCard } from "@/components/dashboard/badges-card";
import { ContinueList } from "@/components/dashboard/continue-list";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { PremiumBanner } from "@/components/dashboard/premium-banner";

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
          {greeting}
        </h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Here&apos;s your learning progress.
        </p>
        <SparklineStats />
      </motion.div>

      <div className="h-px bg-border/40" />

      <AiInsight />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakCard />
        <HeatmapCard />
      </div>

      {/* Badges + Premium upsell */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BadgesCard />
        <PremiumBanner />
      </div>

      <ContinueList />

      <div className="h-px bg-border/40" />

      <ActivityTable />
    </main>
  );
}
