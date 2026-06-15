"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTodayChallenges } from "@/lib/api/submissions";
import { useAuthStore } from "@/stores/auth-store";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const diffColor: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

export function TodayChallenges() {
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["today-challenges"],
    queryFn: getTodayChallenges,
    enabled: isPro,
    staleTime: 60000,
  });

  /* Free user */
  if (!isPro) {
    return (
      <>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Today</span>
          </div>
          <div className="rounded-lg bg-card/50 px-4 py-5 flex items-center gap-4">
            <Lock className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-foreground">Daily challenges are a Pro feature</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Get 3 tailored problems every day, matched to your weak areas.</p>
            </div>
            <button
              onClick={() => setUpgradeOpen(true)}
              className="text-[11px] font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors shrink-0"
            >
              Upgrade →
            </button>
          </div>
        </div>
        <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      </>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Today</span>
        </div>
        <div className="space-y-px">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  const problems = data?.problems ?? [];
  const solved = problems.filter((p) => p.attempted).length;

  /* Empty state */
  if (!problems.length) {
    return (
      <>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Today</span>
          </div>
          <div className="rounded-lg border border-dashed border-border px-4 py-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-foreground">No problems picked for today</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Generate 3 AI-picked problems tailored to your weak areas.
              </p>
            </div>
            <button
              onClick={() => setGenerateOpen(true)}
              className="text-[11px] font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors shrink-0"
            >
              Pick problems →
            </button>
          </div>
        </div>
        <GenerateChallengeDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
      </>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Today</span>
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground/50">
          {solved} / {problems.length} done
        </span>
      </div>

      {/* Challenge rows */}
      <div className="rounded-lg bg-card/50 overflow-hidden divide-y divide-border/50">
        {problems.map((problem, i) => {
          const pathSlug = problem.stack === "django" ? "django-models" : "python-fundamentals";
          const done = problem.attempted;

          return (
            <Link key={problem.id} href={`/challenge/${pathSlug}/${problem.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors duration-150 cursor-pointer group"
              >
                {/* Status */}
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  : <Circle className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0 transition-colors duration-150" />
                }

                {/* Title */}
                <span className={`text-[13px] font-medium flex-1 truncate transition-colors duration-150 ${
                  done ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"
                }`}>
                  {problem.title}
                </span>

                {/* Meta */}
                <div className="flex items-center gap-3 shrink-0">
                  {problem.concept && (
                    <span className="text-[10px] text-muted-foreground/60 hidden sm:block">{problem.concept}</span>
                  )}
                  <span className={`text-[10px] font-semibold ${diffColor[problem.difficulty] ?? "text-muted-foreground"}`}>
                    {problem.difficulty}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
