import apiClient from "./client";
import type { PathDifficulty, ProblemDifficulty, ProblemStatus, ProblemType, Stack } from "./types";

export interface Path {
  id: string;
  title: string;
  slug: string;
  description: string;
  stack: Stack;
  difficulty: PathDifficulty;
  topics: string[];
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  problem_count: number;
}

export interface Unit {
  unit: string;
  label: string;
  unit_sort_order: number;
  total: number;
  free: number;
  solved: number;
  description: string | null;
}

export interface Problem {
  id: string;
  path_id: string;
  title: string;
  slug: string;
  type: ProblemType;
  difficulty: ProblemDifficulty;
  stack: Stack;
  concept: string;
  time_estimate: string;
  unit: string;
  unit_sort_order: number;
  is_free: boolean;
  is_generated: boolean;
  sort_order: number;
  locked: boolean;
  user_status: ProblemStatus | null;
  best_score: number | null;
  attempts: number;
}

export async function getPaths(stack?: Stack) {
  const res = await apiClient.get<Path[]>("/paths", {
    params: stack ? { stack } : undefined,
  });
  return res.data;
}

export async function getPath(slug: string) {
  const res = await apiClient.get<Path>(`/paths/${slug}`);
  return res.data;
}

// Personalizes each unit's `solved` count when a session is present;
// backend allows anonymous access too, just with solved always 0.
export async function getPathUnits(slug: string) {
  const res = await apiClient.get<Unit[]>(`/paths/${slug}/units`);
  return res.data;
}

// Non-Pro users still get every problem back, just with `locked: true` on
// anything that isn't free — filtering that out is a UI decision, not ours.
export async function getPathProblems(slug: string, unit?: string) {
  const res = await apiClient.get<Problem[]>(`/paths/${slug}/problems`, {
    params: unit ? { unit } : undefined,
  });
  return res.data;
}
