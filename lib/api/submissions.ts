import apiClient from "./client";

export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface RunCodeResult {
  passed: boolean;
  score: number;
  execution_time_ms: number;
  test_results: TestResult[];
  error: string | null;
  newly_earned_badges: string[];
  xp_earned: number;
}

// The Python sandbox only — errors (safety violation, syntax error, no
// valid test cases) come back as a 400 with `detail`, not as a 200 with
// `result.error` set. Callers must catch, not branch on a field.
export async function runCode(problemId: string, code: string) {
  const res = await apiClient.post<RunCodeResult>("/submissions/run", {
    problem_id: problemId,
    code,
  });
  return res.data;
}

export interface McqSubmitResult {
  correct: boolean;
  correct_answer: string;
  explanation: string | null;
  newly_earned_badges: string[];
  xp_earned: number;
}

export async function submitMcq(problemId: string, selectedAnswer: string) {
  const res = await apiClient.post<McqSubmitResult>("/submissions/mcq", {
    problem_id: problemId,
    selected_answer: selectedAnswer,
  });
  return res.data;
}

export interface HintResult {
  hint: string;
  hint_number: number;
  level: "gentle" | "medium" | "strong";
}

// Always a fresh AI call, not a lookup — there is no static hint list on
// the problem the client can page through. Usage-gated: a 429 means the
// daily hint quota (5/day on Free, unlimited on Pro) is spent.
export async function getHint(problemId: string, code: string) {
  const res = await apiClient.post<HintResult>(
    "/submissions/hint",
    { problem_id: problemId, code },
    { timeout: 30000 }
  );
  return res.data;
}

export interface ReviewAttributes {
  correctness: number;
  design: number;
  clarity: number;
  efficiency: number;
}

export interface ReviewResult {
  score: number;
  attributes: ReviewAttributes | null;
  summary: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  improved_code: string | null;
  newly_earned_badges: string[];
  xp_earned: number;
}

// Not stack-gated server-side — works for any problem, not just non-Python
// ones. Persists code/best_score/status the same way /submissions/run
// does, and can even move status from "solved" back to "attempted" if a
// later review scores below 70 (see app/services/ai_review.py). Same
// daily quota as hints/solutions (5/day on Free, unlimited on Pro).
export async function getReview(problemId: string, code: string) {
  const res = await apiClient.post<ReviewResult>(
    "/submissions/review",
    { problem_id: problemId, code },
    { timeout: 30000 }
  );
  return res.data;
}

export interface SolutionResult {
  html: string;
}

// Same usage gate as hints (3/day on Free, unlimited on Pro). The backend
// caches the first generated solution on UserProgress, so re-requesting
// after that returns instantly without a new OpenAI call, but the request
// still counts against the daily quota either way.
export async function getSolution(problemId: string) {
  const res = await apiClient.post<SolutionResult>(
    "/submissions/solution",
    { problem_id: problemId },
    { timeout: 30000 }
  );
  return res.data;
}
