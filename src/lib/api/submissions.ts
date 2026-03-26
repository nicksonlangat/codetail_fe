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

export interface McqSubmitResponse {
  correct: boolean;
  correct_answer: string;
  explanation: string | null;
}

export async function submitMcq(problemId: string, selectedAnswer: string) {
  const res = await apiClient.post<McqSubmitResponse>("/submissions/mcq", {
    problem_id: problemId,
    selected_answer: selectedAnswer,
  });
  return res.data;
}

// Practice (AI-generated)
export interface GenerateRequest {
  stack: string;
  concept?: string;
  difficulty?: string;
  problem_type?: string;
}

export async function generatePractice(req: GenerateRequest) {
  const res = await apiClient.post<import("./paths").ProblemDetail>("/practice/generate", req);
  return res.data;
}

export interface PracticeHistoryItem {
  id: string;
  title: string;
  stack: string;
  concept: string;
  difficulty: string;
  type: string;
  created_at: string;
  best_score: number | null;
}

export async function getPracticeHistory(stack?: string, limit = 20, offset = 0) {
  const params: Record<string, string | number> = { limit, offset };
  if (stack) params.stack = stack;
  const res = await apiClient.get<{ items: PracticeHistoryItem[]; total: number }>("/practice/history", { params });
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
