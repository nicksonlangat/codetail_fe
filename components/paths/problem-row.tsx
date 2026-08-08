import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import { PROBLEM_DIFFICULTY_PILL, PROBLEM_TYPE_CONFIG } from "./constants";
import type { Problem } from "@/lib/api/paths";
import type { ProblemStatus } from "@/lib/api/types";

const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

const SCORE_COLOR = (score: number) =>
  score >= 90
    ? "text-brand-success"
    : score >= 50
      ? "text-brand-warning"
      : "text-brand-destructive";

// A missing UserProgress record (never touched) and one with a literal
// "not_started" status (e.g. a code draft autosaved but never run — see
// app/api/submissions.py) mean the same thing, so both map here.
const STATUS_CONFIG: Record<ProblemStatus, { label: string; className: string }> = {
  not_started: { label: "Not started", className: "bg-brand-surface text-brand-text-subtle" },
  attempted: { label: "In progress", className: "bg-brand-primary/10 text-brand-primary" },
  solved: { label: "Solved", className: "bg-brand-success/10 text-brand-success" },
};

interface ProblemRowProps {
  problem: Problem;
  pathSlug: string;
  unitSlug: string;
  index: number;
  delay?: number;
}

export function ProblemRow({ problem, pathSlug, unitSlug, index, delay = 0 }: ProblemRowProps) {
  const type = PROBLEM_TYPE_CONFIG[problem.type];
  const status = STATUS_CONFIG[problem.user_status ?? "not_started"];

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ENTRANCE, delay }}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-lg border transition-all duration-500 ${
        problem.locked
          ? "border-brand-border-strong bg-brand-surface/40"
          : problem.user_status === "solved"
            ? "border-brand-success/25 bg-white hover:border-brand-primary/40"
            : "border-brand-border-strong bg-white hover:border-brand-primary/40"
      }`}
    >
      <span className="text-base font-bold text-brand-text-subtle tabular-nums w-7 shrink-0 leading-none select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {problem.locked ? (
        <span className="size-8 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
          <Lock className="size-3.5 text-brand-text-subtle" />
        </span>
      ) : problem.user_status === "solved" ? (
        <span className="size-8 rounded-lg bg-brand-success/10 flex items-center justify-center shrink-0">
          <Check className="size-3.5 text-brand-success" strokeWidth={3} />
        </span>
      ) : (
        <span className="size-8 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
          <type.icon className="size-3.5 text-brand-text-muted" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium truncate ${problem.locked ? "text-brand-text-muted" : "text-brand-text"}`}>
          {problem.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize shrink-0 ${PROBLEM_DIFFICULTY_PILL[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-surface text-brand-text-muted shrink-0">
            <type.icon className="size-2.5" />
            {type.label}
          </span>
          {problem.concept && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-surface text-brand-text-muted truncate hidden sm:inline-block">
              {problem.concept}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {problem.is_generated && <Sparkles className="size-3.5 text-brand-primary" />}
        {problem.attempts > 0 && !problem.locked && (
          <span className="text-[10px] text-brand-text-subtle tabular-nums whitespace-nowrap">
            {problem.attempts} {problem.attempts === 1 ? "try" : "tries"}
          </span>
        )}
        {!problem.locked && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${status.className}`}>
            {status.label}
          </span>
        )}
        {problem.best_score != null && problem.best_score > 0 && (
          <span className={`text-[11px] font-mono font-semibold tabular-nums ${SCORE_COLOR(problem.best_score)}`}>
            {problem.best_score}%
          </span>
        )}
      </div>
    </motion.div>
  );

  if (problem.locked) return content;

  return (
    <Link href={`/paths/${pathSlug}/${unitSlug}/${problem.id}`} className="block cursor-pointer">
      {content}
    </Link>
  );
}
