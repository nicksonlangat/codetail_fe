import apiClient from "./client";

export interface ProblemBrief {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  stack: string;
  concept: string;
  path_title?: string;
}

export interface InterviewResponse {
  id: string;
  title: string;
  description: string;
  role: string;
  problem_count: number;
  time_limit_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface InterviewDetail {
  id: string;
  title: string;
  description: string;
  role: string;
  problems: ProblemBrief[];
  time_limit_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateInterviewRequest {
  title: string;
  description: string;
  role: string;
  problem_ids: string[];
  time_limit_minutes: number;
}

export interface InviteRequest {
  candidate_name: string;
  candidate_email: string;
}

export interface InviteResponse {
  session_id: string;
  token: string;
  assess_url: string;
}

export interface CandidateTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface CandidateSubmission {
  problem_id: string;
  code: string;
  test_results: CandidateTestResult[];
  passed_count: number;
  total_count: number;
  score: number;
  ai_score: number | null;
  ai_feedback: string | null;
  submitted_at: string | null;
  time_spent_seconds: number;
}

export interface CandidateSession {
  id: string;
  candidate_name: string;
  candidate_email: string;
  status: "pending" | "in_progress" | "completed" | "expired";
  started_at: string | null;
  expires_at: string | null;
  completed_at: string | null;
  submissions: CandidateSubmission[];
  created_at: string;
  overall_score: number;
}

export interface InterviewResults {
  interview: InterviewDetail;
  sessions: CandidateSession[];
}

// ── Assess (candidate-facing) ──

export interface AssessProblem {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  stack: string;
  concept: string;
  description: string;
  function_signature: string | null;
  starter_code: string;
  examples: { input: string; output: string; explanation?: string }[];
  hints: string[];
  test_cases: { input: string }[];
}

export interface AssessSession {
  session_id: string;
  interview_title: string;
  interview_description: string;
  role: string;
  time_limit_minutes: number;
  status: "pending" | "in_progress" | "completed" | "expired";
  started_at: string | null;
  expires_at: string | null;
  seconds_remaining: number | null;
  problems: AssessProblem[];
  submissions: CandidateSubmission[];
}

export interface AssessSubmitResponse {
  problem_id: string;
  passed: boolean;
  score: number;
  test_results: CandidateTestResult[];
  ai_feedback: string | null;
  error: string | null;
}

// ── API calls ──

export async function createInterview(data: CreateInterviewRequest) {
  const res = await apiClient.post<InterviewDetail>("/interviews", data);
  return res.data;
}

export async function listInterviews() {
  const res = await apiClient.get<InterviewResponse[]>("/interviews");
  return res.data;
}

export async function getInterview(id: string) {
  const res = await apiClient.get<InterviewDetail>(`/interviews/${id}`);
  return res.data;
}

export async function updateInterview(id: string, data: Partial<CreateInterviewRequest> & { is_active?: boolean }) {
  const res = await apiClient.patch<InterviewDetail>(`/interviews/${id}`, data);
  return res.data;
}

export async function deleteInterview(id: string) {
  await apiClient.delete(`/interviews/${id}`);
}

export async function inviteCandidate(interviewId: string, data: InviteRequest) {
  const res = await apiClient.post<InviteResponse>(`/interviews/${interviewId}/invite`, data);
  return res.data;
}

export async function getInterviewResults(interviewId: string) {
  const res = await apiClient.get<InterviewResults>(`/interviews/${interviewId}/results`);
  return res.data;
}

export async function searchProblems(params: {
  q?: string; stack?: string; problem_type?: string; difficulty?: string;
}) {
  const res = await apiClient.get<ProblemBrief[]>("/interviews/problems/search", { params });
  return res.data;
}

// ── Candidate (no auth) ──

export async function getAssessSession(token: string) {
  const res = await apiClient.get<AssessSession>(`/assess/${token}`);
  return res.data;
}

export async function startAssessSession(token: string, candidateName: string) {
  const res = await apiClient.post<AssessSession>(`/assess/${token}/start`, { candidate_name: candidateName });
  return res.data;
}

export async function submitAssessProblem(
  token: string,
  data: { problem_id: string; code: string; time_spent_seconds: number }
) {
  const res = await apiClient.post<AssessSubmitResponse>(`/assess/${token}/submit`, data);
  return res.data;
}

export async function finishAssessSession(token: string) {
  const res = await apiClient.post<AssessSession>(`/assess/${token}/finish`, {});
  return res.data;
}
