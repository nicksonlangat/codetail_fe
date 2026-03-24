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
