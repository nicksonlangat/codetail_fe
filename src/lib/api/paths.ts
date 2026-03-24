import apiClient from "./client";

export interface PathResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  stack: string;
  difficulty: string;
  topics: string[];
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  problem_count: number;
}

export interface ProblemListItem {
  id: string;
  path_id: string;
  title: string;
  slug: string;
  type: string;
  difficulty: string;
  stack: string;
  concept: string;
  time_estimate: string;
  sort_order: number;
  locked: boolean;
}

export interface McqOption {
  id: string;
  label: string;
  code: string | null;
}

export interface ProblemDetail {
  id: string;
  path_id: string;
  title: string;
  slug: string;
  type: string;
  difficulty: string;
  stack: string;
  concept: string;
  time_estimate: string;
  description: string;
  requirements: string[];
  hints: string[];
  starter_code: string;
  mcq_options: McqOption[];
  explanation: string | null;
  issue_description: string | null;
  sort_order: number;
  created_at: string;
}

export async function getPaths(stack?: string) {
  const params = stack ? { stack } : {};
  const res = await apiClient.get<PathResponse[]>("/paths", { params });
  return res.data;
}

export async function getPath(slug: string) {
  const res = await apiClient.get<PathResponse>(`/paths/${slug}`);
  return res.data;
}

export async function getPathProblems(slug: string) {
  const res = await apiClient.get<ProblemListItem[]>(`/paths/${slug}/problems`);
  return res.data;
}

export async function getProblem(id: string) {
  const res = await apiClient.get<ProblemDetail>(`/problems/${id}`);
  return res.data;
}
