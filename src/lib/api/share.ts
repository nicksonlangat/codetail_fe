import apiClient from "./client";
import type { ProblemDetail } from "./paths";

export interface ShareResponse {
  token: string;
  problem_id: string;
  created_by: string;
  visibility: "public" | "private";
  allowed_emails: string[];
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateShareRequest {
  visibility: "public" | "private";
  allowed_emails: string[];
  expires_at: string | null;
}

export interface CommentResponse {
  id: string;
  share_token: string;
  submission_id: string | null;
  author_id: string | null;
  author_name: string;
  body: string;
  line_number: number | null;
  hearts: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export interface CreateCommentRequest {
  body: string;
  line_number: number | null;
  submission_id: string | null;
  author_name: string;
}

export interface SharedProblemResponse extends ProblemDetail {
  share: ShareResponse;
}

export interface ShareSubmissionResponse {
  id: string;
  user_id: string | null;
  problem_id: string;
  submission_type: string;
  result: string;
  score: number;
  code: string;
  test_results: { input: string; expected: string; actual: string; passed: boolean }[];
  execution_time_ms: number | null;
  created_at: string;
}

export interface ShareRunResponse {
  submission_id: string;
  passed: boolean;
  score: number;
  execution_time_ms: number;
  test_results: { input: string; expected: string; actual: string; passed: boolean }[];
  error: string | null;
}

export async function createShare(problemId: string, data: CreateShareRequest) {
  const res = await apiClient.post<ShareResponse>(`/problems/${problemId}/shares`, data);
  return res.data;
}

export async function listShares(problemId: string) {
  const res = await apiClient.get<ShareResponse[]>(`/problems/${problemId}/shares`);
  return res.data;
}

export async function revokeShare(token: string) {
  await apiClient.delete(`/shares/${token}`);
}

export async function getShare(token: string) {
  const res = await apiClient.get<SharedProblemResponse>(`/shares/${token}`);
  return res.data;
}

export async function submitViaShare(token: string, code: string) {
  const res = await apiClient.post<ShareRunResponse>(`/shares/${token}/submit`, { code });
  return res.data;
}

export async function getShareSubmissions(token: string) {
  const res = await apiClient.get<ShareSubmissionResponse[]>(`/shares/${token}/submissions`);
  return res.data;
}

export async function addComment(token: string, data: CreateCommentRequest) {
  const res = await apiClient.post<CommentResponse>(`/shares/${token}/comments`, data);
  return res.data;
}

export async function getComments(token: string, submissionId?: string) {
  const params: Record<string, string> = {};
  if (submissionId) params.submission_id = submissionId;
  const res = await apiClient.get<CommentResponse[]>(`/shares/${token}/comments`, { params });
  return res.data;
}

export async function reactToComment(token: string, commentId: string, vote: "heart" | "up" | "down") {
  const res = await apiClient.post<CommentResponse>(`/shares/${token}/comments/${commentId}/react`, { vote });
  return res.data;
}
