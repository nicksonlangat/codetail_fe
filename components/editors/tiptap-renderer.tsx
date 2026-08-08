"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapRendererProps {
  content: string;
  className?: string;
}

// Read-only display for HTML this app's own backend authored — problem
// descriptions (seeded, e.g. app/seed_data/*.py) and AI-generated solution
// write-ups (app/services/ai_solution.py). Same trust boundary as any
// other server-controlled content already rendered elsewhere, not
// arbitrary user input.
export function TipTapRenderer({ content, className = "" }: TipTapRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content) editor.commands.setContent(content);
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}
