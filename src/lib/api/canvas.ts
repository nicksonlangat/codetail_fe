import apiClient from "./client";

export interface CanvasAPIData {
  id: string;
  title: string;
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CanvasCreatePayload {
  title: string;
  nodes?: Record<string, unknown>[];
  edges?: Record<string, unknown>[];
  notes?: string;
}

export interface CanvasPatchPayload {
  title?: string;
  nodes?: Record<string, unknown>[];
  edges?: Record<string, unknown>[];
  notes?: string;
}

export async function fetchCanvases(): Promise<CanvasAPIData[]> {
  const res = await apiClient.get<CanvasAPIData[]>("/canvases");
  return res.data;
}

export async function createCanvasAPI(payload: CanvasCreatePayload): Promise<CanvasAPIData> {
  const res = await apiClient.post<CanvasAPIData>("/canvases", payload);
  return res.data;
}

export async function patchCanvas(id: string, payload: CanvasPatchPayload): Promise<void> {
  await apiClient.patch(`/canvases/${id}`, payload);
}

export async function removeCanvas(id: string): Promise<void> {
  await apiClient.delete(`/canvases/${id}`);
}
