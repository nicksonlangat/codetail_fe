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
  path_slug: string;
  concept?: string;
  problem_type?: string;
}

export async function generatePractice(req: GenerateRequest) {
  const res = await apiClient.post<import("./paths").ProblemDetail>("/practice/generate", req, {
    timeout: 60000, // AI generation can take 20-30s
  });
  return res.data;
}

export async function enrichProblem(problemId: string) {
  const res = await apiClient.post<import("./paths").ProblemDetail>("/practice/enrich", {
    problem_id: problemId,
  }, { timeout: 60000 });
  return res.data;
}

export interface TodayChallengeItem {
  id: string;
  title: string;
  stack: string;
  concept: string;
  difficulty: string;
  type: string;
  attempted: boolean;
}

export interface TodayResponse {
  problems: TodayChallengeItem[];
  stack: string;
  sent_at: string | null;
}

export async function getTodayChallenges() {
  const res = await apiClient.get<TodayResponse>("/practice/today");
  return res.data;
}

export async function getGeneratedProblems(pathSlug: string) {
  const res = await apiClient.get<import("./paths").ProblemListItem[]>(`/practice/paths/${pathSlug}/generated`);
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
  }, { timeout: 30000 });
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
  }, { timeout: 30000 });
  return res.data;
}

export interface SolutionResponse {
  html: string;
  unlocked_reason: string;
}

export async function getSolution(problemId: string) {
  const res = await apiClient.post<SolutionResponse>("/submissions/solution", {
    problem_id: problemId,
  }, { timeout: 30000 });
  return res.data;
}
