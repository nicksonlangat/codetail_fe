"use client";

import { motion } from "framer-motion";
import { Sun, Sunset, Moon } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { SparklineStats } from "@/components/dashboard/sparkline-stats";
import { AiInsight } from "@/components/dashboard/ai-insight";
import { StreakCard } from "@/components/dashboard/streak-card";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { BadgesCard } from "@/components/dashboard/badges-card";
import { ContinueList } from "@/components/dashboard/continue-list";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { PremiumBanner } from "@/components/dashboard/premium-banner";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const GreetingIcon = hour < 12 ? Sun : hour < 17 ? Sunset : Moon;
  const iconColor = hour < 12 ? "text-yellow-500" : hour < 17 ? "text-orange-400" : "text-indigo-400";

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <GreetingIcon className={`w-4.5 h-4.5 ${iconColor}`} />
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
            {greeting}, {firstName}
          </h1>
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5 ml-6.5">
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
