import apiClient from "./client";
import type { ProblemDifficulty, ProblemType, Stack } from "./types";

export interface Example {
  input: string;
  output: string;
  explanation: string | null;
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface McqOption {
  id: string;
  label: string;
  code: string | null;
}

export interface ProblemFile {
  name: string;
  language: string;
  starter_code: string;
}

export interface ProblemDetail {
  id: string;
  path_id: string;
  title: string;
  slug: string;
  type: ProblemType;
  difficulty: ProblemDifficulty;
  stack: Stack;
  concept: string;
  time_estimate: string;
  description: string;
  function_signature: string;
  examples: Example[];
  test_cases: TestCase[];
  starter_code: string;
  mcq_options: McqOption[];
  explanation: string | null;
  issue_description: string | null;
  files: ProblemFile[];
  unit: string;
  unit_sort_order: number;
  is_free: boolean;
  is_generated: boolean;
  sort_order: number;
  created_at: string;
}

// Never includes model_solution or ai_rubric — the backend strips both
// from this response regardless of auth state.
export async function getProblem(problemId: string) {
  const res = await apiClient.get<ProblemDetail>(`/problems/${problemId}`);
  return res.data;
}
