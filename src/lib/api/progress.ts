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

export interface DayPoint {
  date: string;
  value: number;
}

export interface StatsResponse {
  total_solved: number;
  total_attempted: number;
  total_paths: number;
  accuracy: number;
  avg_score: number;
  solved_per_day: DayPoint[];
  accuracy_per_day: DayPoint[];
  score_per_day: DayPoint[];
}

export interface PathProgressItem {
  path_id: string;
  path_slug: string;
  path_title: string;
  path_icon: string;
  path_description: string;
  topics: string[];
  solved: number;
  total: number;
  pct: number;
}

export interface DashboardResponse {
  active_paths: PathProgressItem[];
  next_problem_path_slug: string | null;
  next_problem_path_title: string | null;
  remaining_in_closest: number;
}

export interface WeakAreaItem {
  concept: string;
  stack: string;
  avg_score: number;
  attempts: number;
  last_attempt: string;
}

export async function getWeakAreas() {
  const res = await apiClient.get<{ areas: WeakAreaItem[] }>("/progress/weak-areas/me");
  return res.data;
}

export interface RecentActivityItem {
  problem_id: string;
  problem_title: string;
  problem_slug: string;
  path_slug: string;
  path_title: string;
  difficulty: string;
  status: string;
  best_score: number;
  last_submission_at: string | null;
}

export async function getRecentActivity(limit = 20, offset = 0) {
  const res = await apiClient.get<RecentActivityItem[]>("/progress/recent/me", {
    params: { limit, offset },
  });
  return res.data;
}

export async function getDashboard() {
  const res = await apiClient.get<DashboardResponse>("/progress/dashboard/me");
  return res.data;
}

export async function getStats() {
  const res = await apiClient.get<StatsResponse>("/progress/stats/me");
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
