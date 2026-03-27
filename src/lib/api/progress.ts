import apiClient from "./client";

export interface SavedHint {
  hint: string;
  level: string;
  hint_number: number;
}

export interface SavedTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface ProgressResponse {
  problem_id: string;
  code: string | null;
  notes: string | null;
  status: string;
  attempts: number;
  best_score: number;
  saved_hints: SavedHint[];
  last_run_results: SavedTestResult[];
  last_run_passed: boolean | null;
  last_run_score: number | null;
  last_review: ReviewData | null;
  last_solution: string | null;
}

export interface ReviewData {
  score: number;
  summary: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  improved_code: string | null;
}

export async function saveCode(problemId: string, code: string) {
  const res = await apiClient.patch<ProgressResponse>(`/progress/${problemId}`, { code });
  return res.data;
}

export interface StreakResponse {
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
}

export async function getStreak() {
  const res = await apiClient.get<StreakResponse>("/progress/streak/me");
  return res.data;
}

export async function saveNotes(problemId: string, notes: string) {
  const res = await apiClient.patch<ProgressResponse>(`/progress/${problemId}`, { notes });
  return res.data;
}

export async function getProgress(problemId: string) {
  const res = await apiClient.get<ProgressResponse>(`/progress/${problemId}`);
  return res.data;
}
