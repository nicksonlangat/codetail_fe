"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnitNote, saveUnitNote } from "@/lib/api/unit-notes";
import { unitNoteKeys } from "@/lib/queries/keys";

export function useUnitNote(pathSlug: string, unitSlug: string) {
  return useQuery({
    queryKey: unitNoteKeys.detail(pathSlug, unitSlug),
    queryFn: () => getUnitNote(pathSlug, unitSlug),
    staleTime: 60_000,
  });
}

export function useSaveUnitNote(pathSlug: string, unitSlug: string) {
  const queryClient = useQueryClient();

  return async (content: string) => {
    await saveUnitNote(pathSlug, unitSlug, content);
    queryClient.setQueryData(unitNoteKeys.detail(pathSlug, unitSlug), { content });
  };
}
