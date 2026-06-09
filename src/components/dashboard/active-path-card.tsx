"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, WandSparkles, Code2, Database, Layout } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/progress";
import { getIcon } from "@/lib/icons";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { useAuthStore } from "@/stores/auth-store";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const starterPaths = [
  { slug: "python-fundamentals", title: "Python Fundamentals", description: "Functions, data structures, idiomatic patterns", icon: Code2 },
  { slug: "django-models", title: "Django Models", description: "Fields, relationships, queries", icon: Database },
  { slug: "django-fundamentals", title: "Django Fundamentals", description: "Views, URLs, templates, forms", icon: Layout },
];

export function ActivePathCard() {
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [generateOpen, setGenerateOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 30000,
  });

  if (isLoading) {
    return <div className="rounded-xl border border-border bg-card p-5 h-44 animate-pulse" />;
  }

  const activePaths = dashboard?.active_paths ?? [];
  const primary = activePaths[0];

  /* ── No active path: pick one ── */
  if (!primary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="rounded-xl border border-border bg-card p-5"
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-0.5">Start here</p>
        <h3 className="text-[14px] font-semibold mb-4">Pick your first path</h3>

        <div className="space-y-1">
          {starterPaths.map((path, i) => {
            const Icon = path.icon;
            return (
              <Link key={path.slug} href={`/paths/${path.slug}`}>
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: i * 0.06 }}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors duration-200 group"
                >
                  <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium">{path.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{path.description}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border/40">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            onClick={() => isPro ? setGenerateOpen(true) : setUpgradeOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <WandSparkles className="w-3 h-3" />
            Generate an AI challenge
          </motion.button>
        </div>

        <GenerateChallengeDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
        <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      </motion.div>
    );
  }

  /* ── Active path ── */
  const Icon = getIcon(primary.path_icon);
  const remaining = dashboard?.remaining_in_closest ?? 0;
  const isComplete = primary.pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="rounded-xl border border-primary/25 bg-card overflow-hidden"
    >
      {/* Top progress bar */}
      <div className="h-[3px] bg-muted w-full">
        <motion.div
          className="h-full bg-primary rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${primary.pct}%` }}
          transition={{ ...spring, delay: 0.15 }}
        />
      </div>

      <div className="p-5 space-y-4">
        {/* Path header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Active path</p>
            <p className="text-[13px] font-semibold truncate">{primary.path_title}</p>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
            {primary.solved}<span className="text-muted-foreground/40">/{primary.total}</span>
          </span>
        </div>

        {/* Insight line */}
        {isComplete ? (
          <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Path complete — start the next one
          </div>
        ) : remaining > 0 ? (
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">{remaining}</span> problem{remaining !== 1 ? "s" : ""} left to finish this path.
          </p>
        ) : null}

        {/* Continue CTA */}
        <Link href={`/paths/${primary.path_slug}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 shadow-[0_2px_12px_-4px_hsl(164_70%_40%/0.35)]"
          >
            {isComplete ? "Start next path" : "Continue"}
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </Link>

        {/* Other active paths */}
        {activePaths.length > 1 && (
          <div className="pt-1 border-t border-border/40 space-y-1">
            {activePaths.slice(1, 3).map((path) => {
              const PathIcon = getIcon(path.path_icon);
              return (
                <Link key={path.path_id} href={`/paths/${path.path_slug}`}>
                  <div className="flex items-center gap-2 py-1.5 group cursor-pointer">
                    <PathIcon className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                    <span className="text-[11px] text-muted-foreground flex-1 truncate group-hover:text-foreground transition-colors duration-200">
                      {path.path_title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-14 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/40 rounded-full" style={{ width: `${path.pct}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground/40 font-mono w-6 text-right">{path.pct}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
