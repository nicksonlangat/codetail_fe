import apiClient from "./client";

export interface UnitNoteResponse {
  content: string;
}

export async function getUnitNote(pathSlug: string, unitSlug: string): Promise<UnitNoteResponse> {
  const res = await apiClient.get<UnitNoteResponse>(`/unit-notes/${pathSlug}/${unitSlug}`);
  return res.data;
}

export async function saveUnitNote(pathSlug: string, unitSlug: string, content: string): Promise<void> {
  await apiClient.put(`/unit-notes/${pathSlug}/${unitSlug}`, { content });
}
