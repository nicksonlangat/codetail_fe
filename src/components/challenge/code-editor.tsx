"use client";

import { useRef } from "react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  language?: string;
}

export function CodeEditor({
  code,
  onChange,
  onKeyDown,
  language = "python",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = code.split("\n");

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 flex overflow-auto bg-editor-bg">
        {/* Line numbers gutter */}
        <div className="flex-shrink-0 pt-3 pb-3 pl-3 pr-2 text-right select-none border-r border-border/30">
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-[10px] leading-[22px] text-editor-gutter font-mono tabular-nums"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1 pt-3 pb-3 px-3 overflow-x-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full h-full bg-transparent font-mono text-[13px] leading-[22px] text-foreground resize-none outline-none caret-editor-cursor"
            spellCheck={false}
            style={{ minHeight: `${lines.length * 22}px` }}
          />
        </div>
      </div>
    </div>
  );
}
