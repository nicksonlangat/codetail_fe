import apiClient from "./client";

export type TutorMode = "hint" | "review" | "solution";

export interface AssistRequest {
  mode: TutorMode;
  message?: string;
  code?: string;
}

export interface AssistResponse {
  reply: string;
  solution_unlocked: boolean;
}

export async function assistTutor(
  problemId: string,
  req: AssistRequest,
): Promise<AssistResponse> {
  const res = await apiClient.post<AssistResponse>(`/ai-tutor/${problemId}/assist`, req);
  return res.data;
}
