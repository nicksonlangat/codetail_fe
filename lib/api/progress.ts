import apiClient from "./client";

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

// Only paths the user has started appear in active_paths — a path with
// zero progress simply won't be present, not shown at 0%.
export async function getDashboard() {
  const res = await apiClient.get<DashboardResponse>("/progress/dashboard/me");
  return res.data;
}

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

export interface ProblemProgress {
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
  last_review: Record<string, unknown> | null;
  last_solution: string | null;
  mcq_selected_answer: string | null;
}

// Returns a synthesized default (status: "not_started", everything else
// empty) rather than 404 when no progress record exists yet — always
// safe to call for any valid problem_id.
export async function getProgress(problemId: string) {
  const res = await apiClient.get<ProblemProgress>(`/progress/${problemId}`);
  return res.data;
}

// Both fields are optional and independent — pass only what changed, the
// backend leaves the other field untouched rather than clearing it.
export async function saveProgress(
  problemId: string,
  data: { code?: string; notes?: string }
) {
  const res = await apiClient.patch<ProblemProgress>(`/progress/${problemId}`, data);
  return res.data;
}
