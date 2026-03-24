import apiClient from "./client";

export interface SavedHint {
  hint: string;
  level: string;
  hint_number: number;
}

export interface ProgressResponse {
  problem_id: string;
  code: string | null;
  status: string;
  attempts: number;
  best_score: number;
  saved_hints: SavedHint[];
}

export async function saveCode(problemId: string, code: string) {
  const res = await apiClient.patch<ProgressResponse>(`/progress/${problemId}`, { code });
  return res.data;
}

export async function getProgress(problemId: string) {
  const res = await apiClient.get<ProgressResponse>(`/progress/${problemId}`);
  return res.data;
}
