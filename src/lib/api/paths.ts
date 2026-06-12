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
  unit: string;
  unit_sort_order: number;
  is_free: boolean;
  is_generated: boolean;
  sort_order: number;
  locked: boolean;
  user_status: string | null;
  best_score: number | null;
}

export interface McqOption {
  id: string;
  label: string;
  code: string | null;
}

export interface Example {
  input: string;
  output: string;
  explanation: string | null;
}

export interface ProblemFile {
  name: string;
  language: string;
  starter_code: string;
}

export interface TestCaseItem {
  input: string;    // JSON dict string e.g. '{"n": 5}'
  expected: string; // JSON value string e.g. '"hello"' or '42'
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
  unit: string;
  description: string;
  function_signature: string;
  examples: Example[];
  test_cases: TestCaseItem[];
  starter_code: string;
  mcq_options: McqOption[];
  explanation: string | null;
  issue_description: string | null;
  files: ProblemFile[];
  is_generated: boolean;
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

export interface UnitItem {
  unit: string;
  label: string;
  unit_sort_order: number;
  total: number;
  free: number;
  solved: number;
  description: string | null;
}

export async function getPathUnits(slug: string) {
  const res = await apiClient.get<UnitItem[]>(`/paths/${slug}/units`);
  return res.data;
}

export async function getPathProblems(slug: string, unit?: string) {
  const params: Record<string, string> = {};
  if (unit) params.unit = unit;
  const res = await apiClient.get<ProblemListItem[]>(`/paths/${slug}/problems`, { params });
  return res.data;
}

export async function getProblem(id: string) {
  const res = await apiClient.get<ProblemDetail>(`/problems/${id}`);
  return res.data;
}
