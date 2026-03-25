"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Lock, CheckCircle2, Circle, Minus, ChevronRight, Loader2 } from "lucide-react";
import { getProblem, type ProblemDetail } from "@/lib/api/paths";
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

interface ProblemCardItem {
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

interface ProblemCardProps {
  problem: ProblemCardItem;
  index: number;
  pathSlug: string;
  expanded: boolean;
  onToggle: () => void;
}

function StatusIcon({ status }: { status: string | null }) {
  if (status === "solved") return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === "attempted") return <Minus className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground/20 flex-shrink-0" />;
}

export function ProblemCard({ problem, index, pathSlug, expanded, onToggle }: ProblemCardProps) {
  const [detail, setDetail] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded && !detail && !problem.locked) {
      setLoading(true);
      getProblem(problem.id).then(setDetail).catch(() => {}).finally(() => setLoading(false));
    }
  }, [expanded, detail, problem.id, problem.locked]);

  if (problem.locked) {
    return (
      <div className="relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer" onClick={onToggle}>
        {/* Real content underneath — blurred */}
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty] ?? "bg-secondary text-muted-foreground"}`}>
            {problem.difficulty}
          </span>
          <span className="text-[13px] font-medium text-foreground flex-1 truncate">{problem.title}</span>
          <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md hidden sm:inline">{problem.concept}</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {problem.time_estimate}
          </div>
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-background/50 flex flex-col items-center justify-center gap-1">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-primary cursor-pointer hover:underline underline-offset-2 transition-all duration-500">
            Upgrade to unlock
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
      whileHover={{ y: -1 }}
      transition={spring}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <StatusIcon status={problem.user_status} />

        <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty] ?? ""}`}>
          {problem.difficulty}
        </span>

        <span className="text-[13px] font-medium text-foreground flex-1 truncate">{problem.title}</span>

        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md hidden sm:inline">
          {problem.concept}
        </span>

        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
          {typeLabel[problem.type] ?? problem.type}
        </span>

        {problem.best_score != null && problem.best_score > 0 && (
          <span className={`text-[10px] font-mono tabular-nums font-medium ${
            problem.best_score >= 90 ? "text-green-500" : problem.best_score >= 50 ? "text-yellow-500" : "text-red-500"
          }`}>
            {problem.best_score}%
          </span>
        )}

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {problem.time_estimate}
        </div>

        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={spring}>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-border">
              {/* Description preview */}
              <div className="mt-3 mb-3">
                {loading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                    <span className="text-[11px] text-muted-foreground">Loading...</span>
                  </div>
                ) : detail?.description ? (
                  <div className="max-h-[120px] overflow-hidden relative">
                    <TipTapRenderer content={detail.description} />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {problem.user_status === "solved" && (
                    <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Solved</span>
                  )}
                  {problem.user_status === "attempted" && (
                    <span className="text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">Attempted</span>
                  )}
                </div>

                <Link href={`/challenge/${pathSlug}/${problem.id}`} onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    className="text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-lg cursor-pointer transition-all duration-500"
                  >
                    {problem.user_status === "solved" ? "Revisit" : problem.user_status === "attempted" ? "Continue" : "Start Challenge"}
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ProblemCardListProps {
  problems: ProblemCardItem[];
  pathSlug: string;
}

export function ProblemCardList({ problems, pathSlug }: ProblemCardListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const unlocked = problems.filter((p) => !p.locked);
  const locked = problems.filter((p) => p.locked);

  return (
    <>
      {/* Unlocked: expandable list */}
      <div className="space-y-2">
        {unlocked.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.03 }}
          >
            <ProblemCard
              problem={problem}
              index={i}
              pathSlug={pathSlug}
              expanded={expandedId === problem.id}
              onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Locked: grid cards with blur */}
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
                className="relative bg-card border border-border rounded-xl p-4 overflow-hidden cursor-pointer group"
              >
                {/* Title — visible, not blurred */}
                <p className="text-[12px] font-medium text-foreground leading-tight relative z-10">{problem.title}</p>

                {/* Rest — blurred */}
                <div className="mt-2 space-y-1.5 blur-[2px] select-none">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty] ?? "bg-secondary text-muted-foreground"}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                      {typeLabel[problem.type] ?? problem.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{problem.concept}</p>
                </div>

                {/* Unlock button */}
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
