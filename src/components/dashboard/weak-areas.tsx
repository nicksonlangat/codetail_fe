"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Sparkles, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWeakAreas } from "@/lib/api/progress";
import { useAuthStore } from "@/stores/auth-store";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function scoreGrade(score: number) {
  if (score >= 70) return { label: "C", text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/12", border: "border-yellow-500/20", bar: "bg-yellow-500" };
  if (score >= 40) return { label: "D", text: "text-orange-500",                     bg: "bg-orange-500/12",  border: "border-orange-500/20",  bar: "bg-orange-500"  };
  return             { label: "F", text: "text-red-500",                              bg: "bg-red-500/12",     border: "border-red-500/20",     bar: "bg-red-500"     };
}

export function WeakAreas() {
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [generateOpen, setGenerateOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<{ concept: string; stack: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["weak-areas"],
    queryFn: getWeakAreas,
    staleTime: 60000,
  });

  if (isLoading) return null;

  const areas = data?.areas ?? [];
  if (!areas.length) return null;

  const handlePractice = (concept: string, stack: string) => {
    if (isPro) {
      setSelectedConcept({ concept, stack });
      setGenerateOpen(true);
    } else {
      setUpgradeOpen(true);
    }
  };

  return (
    <>
      <div>
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-3 h-3 text-red-500/70" />
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Needs work
          </h2>
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[9px] text-muted-foreground/30 tabular-nums">{areas.length}</span>
        </div>

        <div className="space-y-2">
          {areas.map((area, i) => {
            const grade = scoreGrade(area.avg_score);

            return (
              <motion.div
                key={`${area.stack}-${area.concept}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.05 }}
                className={`relative rounded-lg border ${grade.border} bg-card overflow-hidden`}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 inset-y-0 w-0.5 ${grade.bar}`} />

                <div className="flex items-center gap-3 px-3 py-3 pl-4">
                  {/* Score badge */}
                  <div className={`w-8 h-8 rounded-md ${grade.bg} border ${grade.border} flex items-center justify-center shrink-0`}>
                    <span className={`text-[11px] font-black font-mono tabular-nums ${grade.text}`}>
                      {Math.round(area.avg_score)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[12px] font-semibold text-foreground truncate">{area.concept}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/60 shrink-0">{area.stack}</span>
                    </div>

                    {/* Score bar + attempt count */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${grade.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${area.avg_score}%` }}
                          transition={{ ...spring, delay: 0.2 + i * 0.05 }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground/40 tabular-nums font-mono shrink-0">
                        {area.attempts}×
                      </span>
                    </div>
                  </div>

                  {/* Practice CTA — always visible */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={spring}
                    onClick={() => handlePractice(area.concept, area.stack)}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 shrink-0 ${
                      isPro
                        ? `${grade.bg} ${grade.text} border ${grade.border} hover:opacity-80`
                        : "bg-muted text-muted-foreground/50 border border-border/40 hover:text-foreground"
                    }`}
                  >
                    {isPro
                      ? <><Sparkles className="w-2.5 h-2.5" /> Practice</>
                      : <><Lock className="w-2.5 h-2.5" /> Practice</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <GenerateChallengeDialog
        open={generateOpen}
        onClose={() => { setGenerateOpen(false); setSelectedConcept(null); }}
        pathStack={selectedConcept?.stack}
      />
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="Practice your weak areas with unlimited AI-generated challenges."
      />
    </>
  );
}
