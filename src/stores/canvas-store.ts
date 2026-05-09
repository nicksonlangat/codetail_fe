"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Node, Edge } from "@xyflow/react";
import { DEFAULT_CANVASES } from "@/lib/canvas-seeds";
import { useAuthStore } from "@/stores/auth-store";
import {
  fetchCanvases,
  createCanvasAPI,
  patchCanvas,
  removeCanvas,
  type CanvasAPIData,
} from "@/lib/api/canvas";

export interface CanvasData {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

function fromAPI(c: CanvasAPIData): CanvasData {
  return {
    id: c.id,
    title: c.title,
    nodes: c.nodes as Node[],
    edges: c.edges as Edge[],
    notes: c.notes,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

interface CanvasStore {
  canvases: CanvasData[];
  seeded: boolean;
  // Local-only (unauthenticated) operations
  seedDefaults: () => void;
  createCanvas: (title: string) => CanvasData;
  deleteCanvas: (id: string) => void;
  updateCanvas: (id: string, updates: Partial<CanvasData>) => void;
  updateNodes: (id: string, nodes: Node[]) => void;
  updateEdges: (id: string, edges: Edge[]) => void;
  updateNotes: (id: string, notes: string) => void;
  renameCanvas: (id: string, title: string) => void;
  // API-backed operations (authenticated)
  loadFromAPI: () => Promise<void>;
  createCanvasFromAPI: (title: string) => Promise<CanvasData>;
  deleteCanvasFromAPI: (id: string) => Promise<void>;
}

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      canvases: [],
      seeded: false,

      seedDefaults: () => {
        if (get().seeded) return;
        set((s) => ({
          seeded: true,
          canvases: [...DEFAULT_CANVASES, ...s.canvases],
        }));
      },

      createCanvas: (title) => {
        const canvas: CanvasData = {
          id: crypto.randomUUID(),
          title,
          nodes: [],
          edges: [],
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ canvases: [canvas, ...s.canvases] }));
        return canvas;
      },

      updateCanvas: (id, updates) => {
        set((s) => ({
          canvases: s.canvases.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
        const token = useAuthStore.getState().accessToken;
        if (!token) return;
        const payload: Record<string, unknown> = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.nodes !== undefined) payload.nodes = updates.nodes;
        if (updates.edges !== undefined) payload.edges = updates.edges;
        if (updates.notes !== undefined) payload.notes = updates.notes;
        if (Object.keys(payload).length > 0) {
          patchCanvas(id, payload).catch(() => {});
        }
      },

      deleteCanvas: (id) =>
        set((s) => ({ canvases: s.canvases.filter((c) => c.id !== id) })),

      updateNodes: (id, nodes) => get().updateCanvas(id, { nodes }),
      updateEdges: (id, edges) => get().updateCanvas(id, { edges }),
      updateNotes: (id, notes) => get().updateCanvas(id, { notes }),
      renameCanvas: (id, title) => get().updateCanvas(id, { title }),

      // ── API-backed ────────────────────────────────────────────────────────

      loadFromAPI: async () => {
        const apiCanvases = await fetchCanvases();
        if (apiCanvases.length === 0) {
          // First visit — seed defaults via API
          const seeds = await Promise.all(
            DEFAULT_CANVASES.map((s) =>
              createCanvasAPI({
                title: s.title,
                nodes: s.nodes as Record<string, unknown>[],
                edges: s.edges as Record<string, unknown>[],
                notes: s.notes,
              })
            )
          );
          set({ canvases: seeds.map(fromAPI), seeded: true });
        } else {
          set({ canvases: apiCanvases.map(fromAPI), seeded: true });
        }
      },

      createCanvasFromAPI: async (title) => {
        const data = await createCanvasAPI({ title });
        const canvas = fromAPI(data);
        set((s) => ({ canvases: [canvas, ...s.canvases] }));
        return canvas;
      },

      deleteCanvasFromAPI: async (id) => {
        await removeCanvas(id);
        set((s) => ({ canvases: s.canvases.filter((c) => c.id !== id) }));
      },
    }),
    { name: "codetail-canvases" }
  )
);
