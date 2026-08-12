import apiClient from "./client";

export interface GitHubRepo {
  full_name: string;
  name: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  url: string;
  updated_at: string;
}

export interface GitHubReposResponse {
  repos: GitHubRepo[];
  installation_id: string;
  repository_selection: "all" | "selected";
}

export interface ImportedProject {
  name: string;
  description: string;
  tech: string;
  github_url: string;
}

export async function connectGitHub(installation_id: string): Promise<void> {
  await apiClient.post("/github/connect", { installation_id });
}

export async function disconnectGitHub(): Promise<void> {
  await apiClient.delete("/github/connect");
}

export async function getGitHubRepos(): Promise<GitHubReposResponse> {
  const res = await apiClient.get<GitHubReposResponse>("/github/repos");
  return res.data;
}

export interface ImportRepoPayload extends Pick<GitHubRepo, "full_name" | "name" | "description" | "language" | "topics" | "url"> {
  group_id?: string | null;
  group_name?: string | null;
}

export async function importGitHubRepos(repos: ImportRepoPayload[]): Promise<ImportedProject[]> {
  const res = await apiClient.post<{ projects: ImportedProject[] }>("/github/import", { repos });
  return res.data.projects;
}
