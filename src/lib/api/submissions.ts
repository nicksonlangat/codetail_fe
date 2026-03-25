import apiClient from "./client";

export interface TestResultResponse {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface RunCodeResponse {
  passed: boolean;
  score: number;
  execution_time_ms: number;
  test_results: TestResultResponse[];
  error: string | null;
}

export async function runCode(problemId: string, code: string) {
  const res = await apiClient.post<RunCodeResponse>("/submissions/run", {
    problem_id: problemId,
    code,
  });
  return res.data;
}

export interface HintResponse {
  hint: string;
  hint_number: number;
  level: string;
}

export async function getHint(problemId: string, code: string) {
  const res = await apiClient.post<HintResponse>("/submissions/hint", {
    problem_id: problemId,
    code,
  });
  return res.data;
}

export interface ReviewResponse {
  score: number;
  summary: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  improved_code: string | null;
}

export async function getReview(problemId: string, code: string) {
  const res = await apiClient.post<ReviewResponse>("/submissions/review", {
    problem_id: problemId,
    code,
  });
  return res.data;
}

export interface SolutionResponse {
  html: string;
  unlocked_reason: string;
}

export async function getSolution(problemId: string) {
  const res = await apiClient.post<SolutionResponse>("/submissions/solution", {
    problem_id: problemId,
  });
  return res.data;
}
