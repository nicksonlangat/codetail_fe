import { Code2, HelpCircle, RefreshCcw, Wrench } from "lucide-react";
import type { PathDifficulty, ProblemDifficulty, ProblemType } from "@/lib/api/types";

// PathDifficulty (beginner/intermediate/advanced) — a whole path's level.
export const DIFFICULTY_STYLES: Record<PathDifficulty, string> = {
  beginner: "bg-brand-success/10 border border-brand-success/30 text-brand-success",
  intermediate: "bg-brand-warning/10 border border-brand-warning/30 text-brand-warning",
  advanced: "bg-brand-destructive/10 border border-brand-destructive/30 text-brand-destructive",
};

// ProblemDifficulty (easy/medium/hard) — a single problem's level. Distinct
// enum from PathDifficulty above; don't conflate the two.
export const PROBLEM_DIFFICULTY_DOT: Record<ProblemDifficulty, string> = {
  easy: "bg-brand-success",
  medium: "bg-brand-warning",
  hard: "bg-brand-destructive",
};

export const PROBLEM_DIFFICULTY_PILL: Record<ProblemDifficulty, string> = {
  easy: "bg-brand-success/10 text-brand-success",
  medium: "bg-brand-warning/10 text-brand-warning",
  hard: "bg-brand-destructive/10 text-brand-destructive",
};

// Mirrors XP_TABLE in backend/app/services/rewards.py exactly. XP is a flat
// amount by difficulty, granted once on first solve — no bonus for speed,
// attempts, or which grading path solves it (sandbox pass, correct MCQ, and
// an AI review scoring >= 70 all award the same amount).
export const PROBLEM_DIFFICULTY_XP: Record<ProblemDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 40,
};

export const PROBLEM_TYPE_CONFIG: Record<ProblemType, { label: string; icon: typeof Code2 }> = {
  write_code: { label: "Code", icon: Code2 },
  fix_code: { label: "Fix", icon: Wrench },
  mcq: { label: "MCQ", icon: HelpCircle },
  refactor: { label: "Refactor", icon: RefreshCcw },
};
