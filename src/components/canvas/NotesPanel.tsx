"use client";
import { useCallback } from "react";
import { StickyNote } from "lucide-react";

interface NotesPanelProps {
  notes: string;
  onChange: (value: string) => void;
}

export function NotesPanel({ notes, onChange }: NotesPanelProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <aside className="flex h-full w-full flex-col bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 shrink-0">
        <StickyNote className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 truncate">
          Notes
        </p>
      </div>

      <div className="flex-1 overflow-hidden p-3">
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder={"Add notes...\n\n• Key decisions\n• Trade-offs\n• Open questions"}
          className="h-full w-full resize-none bg-transparent text-[11px] leading-relaxed text-foreground/80 placeholder:text-muted-foreground/40 outline-none"
        />
      </div>

      <div className="shrink-0 border-t border-border px-3 py-2">
        <p className="text-[9px] text-muted-foreground/40">
          {notes.length > 0 ? `${notes.length} chars` : "Empty"}
        </p>
      </div>
    </aside>
  );
}
