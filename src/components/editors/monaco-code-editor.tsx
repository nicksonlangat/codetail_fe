"use client";

import Editor, { type OnMount, loader } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCallback, useRef, useEffect, useState } from "react";

// Define custom themes that match our design system
function defineThemes() {
  loader.init().then((monaco) => {
    monaco.editor.defineTheme("codetail-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "#6c9ef8" },
        { token: "keyword.control", foreground: "#6c9ef8" },
        { token: "type", foreground: "#e5c07b" },
        { token: "type.identifier", foreground: "#e5c07b" },
        { token: "identifier", foreground: "#d4d8e8" },
        { token: "variable", foreground: "#d4d8e8" },
        { token: "number", foreground: "#d19a66" },
        { token: "string", foreground: "#89b482" },
        { token: "string.escape", foreground: "#d19a66" },
        { token: "comment", foreground: "#5c6370", fontStyle: "italic" },
        { token: "delimiter", foreground: "#8b92a8" },
        { token: "delimiter.bracket", foreground: "#8b92a8" },
        { token: "delimiter.parenthesis", foreground: "#8b92a8" },
        { token: "operator", foreground: "#8b92a8" },
        { token: "function", foreground: "#61afef" },
        { token: "method", foreground: "#61afef" },
        { token: "class", foreground: "#e5c07b" },
        { token: "decorator", foreground: "#e5c07b" },
        { token: "constant", foreground: "#d19a66" },
        { token: "builtin", foreground: "#d19a66" },
        { token: "parameter", foreground: "#d4d8e8" },
        { token: "regexp", foreground: "#89b482" },
      ],
      colors: {
        "editor.background": "#131620",
        "editor.foreground": "#d4d8e8",
        "editor.lineHighlightBackground": "#1a1d2e",
        "editor.selectionBackground": "#1a9a7a30",
        "editorLineNumber.foreground": "#3a3f55",
        "editorLineNumber.activeForeground": "#6b7394",
        "editorCursor.foreground": "#1a9a7a",
        "editor.selectionHighlightBackground": "#1a9a7a15",
        "editorGutter.background": "#131620",
        "editorWidget.background": "#181b28",
        "editorWidget.border": "#252940",
        "input.background": "#1a1d2e",
        "scrollbarSlider.background": "#ffffff10",
        "scrollbarSlider.hoverBackground": "#ffffff20",
      },
    });

    monaco.editor.defineTheme("codetail-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#fafafa",
        "editor.foreground": "#1a1d2e",
        "editor.lineHighlightBackground": "#f0f1f4",
        "editor.selectionBackground": "#1a9a7a20",
        "editorLineNumber.foreground": "#b0b4c0",
        "editorLineNumber.activeForeground": "#6b7080",
        "editorCursor.foreground": "#1a9a7a",
        "editorGutter.background": "#fafafa",
        "scrollbarSlider.background": "#00000010",
        "scrollbarSlider.hoverBackground": "#00000020",
      },
    });
  });
}

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
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
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    defineThemes();
    setReady(true);
  }, []);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  if (!ready) return null;

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme={resolvedTheme === "dark" ? "codetail-dark" : "codetail-light"}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 4,
        insertSpaces: true,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "gutter",
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
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
