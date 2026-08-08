"use client";

import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";

function defineTheme() {
  loader.init().then((monaco) => {
    monaco.editor.defineTheme("codetail-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "0898A0" },
        { token: "keyword.control", foreground: "0898A0" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#1B1D20",
        "editor.lineHighlightBackground": "#F3F4F6",
        "editor.selectionBackground": "#0898A026",
        "editorLineNumber.foreground": "#94A3B8",
        "editorLineNumber.activeForeground": "#64748B",
        "editorCursor.foreground": "#0898A0",
        "editorGutter.background": "#FFFFFF",
        "scrollbarSlider.background": "#00000010",
        "scrollbarSlider.hoverBackground": "#00000020",
      },
    });
  });
}

interface MonacoCodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export function MonacoCodeEditor({
  value,
  onChange,
  language = "python",
  readOnly = false,
  height = "100%",
}: MonacoCodeEditorProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    defineTheme();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme="codetail-light"
      onChange={(v) => onChange?.(v ?? "")}
      options={{
        readOnly,
        domReadOnly: readOnly,
        minimap: { enabled: false },
        fontSize: 12.5,
        fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 4,
        insertSpaces: true,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: readOnly ? "none" : "gutter",
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        cursorStyle: readOnly ? "line-thin" : "line",
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
}
