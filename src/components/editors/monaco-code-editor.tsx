"use client";

import Editor, { type OnMount, loader } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCallback, useRef, useEffect, useState } from "react";
import type * as monaco from "monaco-editor";

// Define custom themes that match our design system
function defineThemes() {
  loader.init().then((monaco) => {
    monaco.editor.defineTheme("codetail-dark", {
      base: "vs-dark",
      inherit: true,
      // GitHub Dark syntax token colors
      rules: [
        { token: "keyword",              foreground: "FF7B72" },
        { token: "keyword.control",      foreground: "FF7B72" },
        { token: "type",                 foreground: "FFA657" },
        { token: "type.identifier",      foreground: "FFA657" },
        { token: "class",                foreground: "FFA657" },
        { token: "decorator",            foreground: "D2A8FF" },
        { token: "identifier",           foreground: "E6EDF3" },
        { token: "variable",             foreground: "E6EDF3" },
        { token: "parameter",            foreground: "E6EDF3" },
        { token: "number",               foreground: "79C0FF" },
        { token: "constant",             foreground: "79C0FF" },
        { token: "builtin",              foreground: "79C0FF" },
        { token: "string",               foreground: "A5D6FF" },
        { token: "string.escape",        foreground: "A5D6FF" },
        { token: "regexp",               foreground: "A5D6FF" },
        { token: "comment",              foreground: "8B949E", fontStyle: "italic" },
        { token: "delimiter",            foreground: "C9D1D9" },
        { token: "delimiter.bracket",    foreground: "C9D1D9" },
        { token: "delimiter.parenthesis",foreground: "C9D1D9" },
        { token: "operator",             foreground: "FF7B72" },
        { token: "function",             foreground: "D2A8FF" },
        { token: "method",               foreground: "D2A8FF" },
      ],
      colors: {
        "editor.background":                  "#1B1D20",
        "editor.foreground":                  "#E6EDF3",
        "editor.lineHighlightBackground":     "#2A2D3160",
        "editor.selectionBackground":         "#1FAD8728",
        "editor.selectionHighlightBackground":"#1FAD8714",
        "editorLineNumber.foreground":        "#42464E",
        "editorLineNumber.activeForeground":  "#8C95A3",
        "editorCursor.foreground":            "#1FAD87",
        "editorGutter.background":            "#1B1D20",
        "editorWidget.background":            "#2A2D31",
        "editorWidget.border":                "#42464E",
        "input.background":                   "#2A2D31",
        "scrollbarSlider.background":         "#42464E40",
        "scrollbarSlider.hoverBackground":    "#42464E80",
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
  const changeListenerRef = useRef<{ dispose: () => void } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    defineThemes();
    setReady(true);
  }, []);

  const handleMount: OnMount = useCallback((editor, monacoInstance) => {
    editorRef.current = editor;
    editor.focus();

    // Decorate function/method call sites with GitHub Dark purple (#D2A8FF).
    // Monaco's Python tokenizer classifies all identifiers the same; this post-pass
    // uses a lookahead regex to find identifiers followed by ( and marks them.
    const PY_KEYWORDS = new Set([
      "False","None","True","and","as","assert","async","await","break","class",
      "continue","def","del","elif","else","except","finally","for","from",
      "global","if","import","in","is","lambda","nonlocal","not","or","pass",
      "raise","return","try","while","with","yield",
    ]);
    const decColl = editor.createDecorationsCollection([]);
    const FN_RE = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;

    const decorate = () => {
      const model = editor.getModel();
      if (!model) return;
      const text = model.getValue();
      const next: monaco.editor.IModelDeltaDecoration[] = [];
      let m: RegExpExecArray | null;
      FN_RE.lastIndex = 0;
      while ((m = FN_RE.exec(text)) !== null) {
        if (PY_KEYWORDS.has(m[1])) continue;
        const s = model.getPositionAt(m.index);
        const e = model.getPositionAt(m.index + m[1].length);
        next.push({
          range: new monacoInstance.Range(s.lineNumber, s.column, e.lineNumber, e.column),
          options: { inlineClassName: "codetail-fn-call" },
        });
      }
      decColl.set(next);
    };

    decorate();
    changeListenerRef.current = editor.onDidChangeModelContent(decorate);
  }, []);

  useEffect(() => () => { changeListenerRef.current?.dispose(); }, []);

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
