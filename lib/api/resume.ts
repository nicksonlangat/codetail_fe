import apiClient from "./client";

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  duration: string;
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  tech: string;
  github_url?: string;
  live_url?: string;
}

export interface ResumeData {
  id: string;
  file_name: string;
  template_id: string;
  name: string;
  profile: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  projects: ResumeProject[];
  created_at: string;
  updated_at: string;
}

export async function getResume(): Promise<ResumeData> {
  const res = await apiClient.get<ResumeData>("/resume");
  return res.data;
}

export async function uploadResume(file: File): Promise<ResumeData> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<ResumeData>("/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export interface ResumeAnalysis {
  score: number;
  dimensions: { keywords: number; experience: number; format: number; impact: number };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
}

export async function getResumeAnalysis(): Promise<ResumeAnalysis | null> {
  try {
    const res = await apiClient.get<ResumeAnalysis>("/resume/analysis");
    return res.data;
  } catch (e: unknown) {
    if ((e as { response?: { status?: number } })?.response?.status === 404) return null;
    throw e;
  }
}

export async function runResumeAnalysis(): Promise<ResumeAnalysis> {
  const res = await apiClient.post<ResumeAnalysis>("/resume/analysis");
  return res.data;
}

export async function updateResume(data: {
  template_id?: string;
  profile: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  projects: ResumeProject[];
}): Promise<ResumeData> {
  const res = await apiClient.patch<ResumeData>("/resume", data);
  return res.data;
}

export interface AIAssistResult { suggestion: string }

export async function getAIAssist(
  field_type: string,
  current_content: string,
  context = ""
): Promise<AIAssistResult> {
  const res = await apiClient.post<AIAssistResult>("/resume/ai-assist", { field_type, current_content, context });
  return res.data;
}

export interface TailoredResume {
  id: string;
  source_resume_id: string;
  job_title: string;
  company: string;
  job_description: string;
  template_id: string;
  profile: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  projects: ResumeProject[];
  ats_score_before: number;
  ats_score_after: number;
  changes: string[];
  created_at: string;
}

export async function tailorResume(job_description: string): Promise<TailoredResume> {
  const res = await apiClient.post<TailoredResume>("/resume/tailor", { job_description });
  return res.data;
}

export async function listTailoredResumes(): Promise<TailoredResume[]> {
  const res = await apiClient.get<TailoredResume[]>("/resume/tailored");
  return res.data;
}

export async function deleteTailoredResume(id: string): Promise<void> {
  await apiClient.delete(`/resume/tailored/${id}`);
}

export function getTailoredDownloadUrl(id: string): string {
  return `/resume/tailored/${id}/download`;
}
