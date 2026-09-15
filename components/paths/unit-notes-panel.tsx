"use client";

import { useRef } from "react";
import { NotesEditor } from "@/components/editors/notes-editor";
import { useUnitNote, useSaveUnitNote } from "@/lib/queries/use-unit-notes";
import { Spinner } from "@/components/ui/spinner";

const AUTOSAVE_MS = 1200;

export function UnitNotesPanel({ pathSlug, unitSlug }: { pathSlug: string; unitSlug: string }) {
  const { data, isLoading } = useUnitNote(pathSlug, unitSlug);
  const save = useSaveUnitNote(pathSlug, unitSlug);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(html: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      save(html);
    }, AUTOSAVE_MS);
  }

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="min-h-96">
      <NotesEditor content={data?.content ?? ""} onChange={handleChange} />
    </div>
  );
}
