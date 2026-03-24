"use client";

import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  language?: string;
}

export function CodeEditor({ code, onChange, language = "python" }: CodeEditorProps) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <MonacoCodeEditor value={code} onChange={onChange} language={language} />
    </div>
  );
}
