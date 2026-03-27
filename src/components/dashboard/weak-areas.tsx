"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sparkles, ArrowRight, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWeakAreas } from "@/lib/api/progress";
import { useAuthStore } from "@/stores/auth-store";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function scoreColor(score: number) {
  if (score >= 50) return { text: "text-yellow-600", bg: "bg-yellow-500/10", bar: "bg-yellow-500" };
  return { text: "text-red-500", bg: "bg-red-500/10", bar: "bg-red-500" };
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
        <div className="flex items-center gap-2 mb-3 px-1">
          <TrendingDown className="w-3 h-3 text-muted-foreground/50" />
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Needs work
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-2">
          {areas.map((area, i) => {
            const colors = scoreColor(area.avg_score);
            return (
              <motion.div key={`${area.stack}-${area.concept}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/50 bg-card group hover:border-border transition-all duration-500"
              >
                {/* Score badge */}
                <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-[12px] font-bold font-mono tabular-nums ${colors.text}`}>
                    {Math.round(area.avg_score)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-foreground">{area.concept}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{area.stack}</span>
                  </div>

                  {/* Score bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${colors.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${area.avg_score}%` }}
                        transition={{ ...spring, delay: 0.2 + i * 0.05 }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground tabular-nums font-mono">
                      {area.attempts} attempt{area.attempts !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Practice CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  onClick={() => handlePractice(area.concept, area.stack)}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                >
                  <Sparkles className="w-3 h-3" />
                  Practice
                </motion.button>
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
