"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Lock, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { getProblem } from "@/lib/api/paths";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const difficultyColor: Record<string, string> = {
  easy: "bg-difficulty-easy/10 text-difficulty-easy",
  medium: "bg-difficulty-medium/10 text-difficulty-medium",
  hard: "bg-difficulty-hard/10 text-difficulty-hard",
};

const typeLabel: Record<string, string> = {
  write_code: "Code",
  mcq: "MCQ",
  fix_code: "Fix",
  refactor: "Refactor",
};

export interface ProblemCardItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  difficulty: string;
  concept: string;
  time_estimate: string;
  locked: boolean;
  user_status: string | null;
  best_score: number | null;
}

function ctaLabel(status: string | null) {
  if (status === "solved") return "Revisit";
  if (status === "attempted") return "Continue";
  return "Start";
}

function UnlockedCard({
  problem,
  pathSlug,
  onDelete,
}: {
  problem: ProblemCardItem;
  pathSlug: string;
  onDelete?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleMouseEnter() {
    setHovered(true);
    if (!description && !loading) {
      setLoading(true);
      getProblem(problem.id)
        .then((d) => setDescription(d.description ?? null))
        .catch(() => setDescription(null))
        .finally(() => setLoading(false));
    }
  }

  return (
    <Link
      href={`/challenge/${pathSlug}/${problem.id}`}
      className="relative bg-card border border-border rounded-lg p-4 cursor-pointer group flex flex-col gap-2.5 transition-colors duration-150 hover:border-primary/30 hover:shadow-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      style={{ willChange: "height" }}
    >
      {/* Top: badges + trash */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty] ?? "bg-secondary text-muted-foreground"}`}>
            {problem.difficulty}
          </span>
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
            {typeLabel[problem.type] ?? problem.type}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(problem.id); }}
            className="p-0.5 rounded hover:bg-red-500/10 text-muted-foreground/20 hover:text-red-500 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Title */}
      <p className="text-[12px] font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-150">
        {problem.title}
      </p>

      {/* Concept */}
      {problem.concept && (
        <p className="text-[10px] text-muted-foreground/50 truncate">{problem.concept}</p>
      )}

      {/* Hover: description preview */}
      <AnimatePresence initial={false}>
        {hovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 76, opacity: 1, transition: spring }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t border-border/40 h-full">
              {loading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <Loader2 className="w-3 h-3 text-muted-foreground/30 animate-spin" />
                </div>
              ) : description ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="max-h-20 overflow-hidden relative text-[11px] text-muted-foreground/60 leading-relaxed"
                >
                  <TipTapRenderer content={description} />
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-card to-transparent" />
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer: time + score + cta */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-auto">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
          <Clock className="w-3 h-3" />
          {problem.time_estimate}
        </div>
        <div className="flex items-center gap-2">
          {problem.best_score != null && problem.best_score > 0 && (
            <span className={`text-[10px] font-mono tabular-nums font-semibold ${
              problem.best_score >= 90 ? "text-green-500" : problem.best_score >= 50 ? "text-yellow-500" : "text-red-500"
            }`}>
              {problem.best_score}%
            </span>
          )}
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {ctaLabel(problem.user_status)} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

interface ProblemCardListProps {
  problems: ProblemCardItem[];
  pathSlug: string;
  onDelete?: (id: string) => void;
}

export function ProblemCardList({ problems, pathSlug, onDelete }: ProblemCardListProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const unlocked = problems.filter((p) => !p.locked);
  const locked = problems.filter((p) => p.locked);

  return (
    <>
      {/* Unlocked: card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {unlocked.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.03 }}
          >
            <UnlockedCard problem={problem} pathSlug={pathSlug} onDelete={onDelete} />
          </motion.div>
        ))}
      </div>

      {/* Locked: same grid, blurred */}
      {locked.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Lock className="w-3 h-3 text-muted-foreground/40" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
              {locked.length} more with Pro
            </span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {locked.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.02 }}
                onClick={() => setShowUpgrade(true)}
                className="relative bg-card border border-border rounded-lg p-4 overflow-hidden cursor-pointer group hover:border-border/80 transition-colors duration-150"
              >
                <p className="text-[12px] font-medium text-foreground leading-tight relative z-10">{problem.title}</p>

                <div className="mt-2 space-y-1.5 blur-[2px] select-none">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty] ?? "bg-secondary text-muted-foreground"}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                      {typeLabel[problem.type] ?? problem.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{problem.concept}</p>
                </div>

                <div className="mt-3 relative z-10">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
                    <Lock className="w-3 h-3" />
                    Unlock with Pro
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} trigger="Unlock all problems in this path to continue your learning journey." />
    </>
  );
}
