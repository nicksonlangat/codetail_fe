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

export interface ResumeData {
  id: string;
  file_name: string;
  profile: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
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
