import apiClient from "./client";
import type { ProjectMode, ProjectTier, ProjectStatus, ProjectGradingMode } from "./types";

export interface TestResultItem {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface ProjectAttempt {
  id: string;
  project_id: string;
  status: ProjectStatus;
  code: string | null;
  notes: string | null;
  started_at: string;
  completed_at: string | null;
  last_run_results: TestResultItem[];
  last_run_passed: boolean | null;
  last_run_score: number | null;
  xp_awarded: number;
}

export interface ProjectListItem {
  id: string;
  title: string;
  ticket_id: string;
  repo: string;
  scenario: string;
  mode: ProjectMode;
  tier: ProjectTier;
  category: string;
  tags: string[];
  estimated_minutes: number;
  user_status: ProjectStatus | null;
}

export interface ProjectTestCase {
  input: string;
  expected: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  ticket_id: string;
  repo: string;
  scenario: string;
  instructions: string;
  mode: ProjectMode;
  tier: ProjectTier;
  category: string;
  tags: string[];
  estimated_minutes: number;
  starter_code: string;
  grading_mode: ProjectGradingMode;
  test_cases: ProjectTestCase[];
  current_attempt: ProjectAttempt | null;
}

export interface ProjectSubmitResult {
  passed: boolean;
  score: number;
  test_results: TestResultItem[];
  review: Record<string, unknown> | null;
  xp_earned: number;
  newly_completed: boolean;
}

export interface TierStats {
  done: number;
  total: number;
}

export interface SuggestedNext {
  id: string;
  ticket_id: string;
  title: string;
  mode: ProjectMode;
  tier: ProjectTier;
  why: string;
}

export interface ProjectStats {
  completed: number;
  in_progress: number;
  total_minutes: number;
  by_tier: Record<ProjectTier, TierStats>;
  suggested_next: SuggestedNext | null;
}

export async function getProjects(params?: { mode?: ProjectMode; tier?: ProjectTier }): Promise<ProjectListItem[]> {
  const res = await apiClient.get<ProjectListItem[]>("/projects", { params });
  return res.data;
}

export async function getProject(id: string): Promise<ProjectDetail> {
  const res = await apiClient.get<ProjectDetail>(`/projects/${id}`);
  return res.data;
}

export async function startProject(id: string): Promise<ProjectAttempt> {
  const res = await apiClient.post<ProjectAttempt>(`/projects/${id}/start`);
  return res.data;
}

export async function saveProjectCode(id: string, data: { code?: string; notes?: string }): Promise<ProjectAttempt> {
  const res = await apiClient.patch<ProjectAttempt>(`/projects/${id}/code`, data);
  return res.data;
}

export async function submitProject(id: string, code: string): Promise<ProjectSubmitResult> {
  const res = await apiClient.post<ProjectSubmitResult>(`/projects/${id}/submit`, { code });
  return res.data;
}

export async function getProjectStats(): Promise<ProjectStats> {
  const res = await apiClient.get<ProjectStats>("/projects/stats/me");
  return res.data;
}
