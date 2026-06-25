"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Send, RotateCcw, Bug, FileCode, Loader2 } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { ChallengeType } from "@/types";
import type { ProblemFile, TestCaseItem } from "@/lib/api/paths";
import { CodeEditor } from "./code-editor";
import { BottomPanel } from "./bottom-panel";
import type { TestCaseResult } from "./test-cases-panel";

interface CodePanelProps {
  problemId: string;
  code: string;
  onCodeChange: (c: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  testCases: TestCaseItem[];
  testResults: TestCaseResult[];
  challengeType: ChallengeType;
  stack?: string;
  files?: ProblemFile[];
  savedCode?: string | null;
  progressLoaded?: boolean;
  initialHints?: { hint: string; hint_number: number; level: string }[];
  initialReview?: any;
  initialSolution?: string | null;
  onBadgesEarned?: (badges: string[], xpEarned: number) => void;
}

// Reverses the "# --- filename ---\ncontent" concatenation used when
// sending multi-file code for AI review, so saved code can repopulate
// each file's tab instead of resetting to starter code.
function splitCombinedCode(combined: string, files: ProblemFile[]): string[] | null {
  const matches = [...combined.matchAll(/^# --- (.+) ---$/gm)];
  if (matches.length === 0) return null;
  const byName = new Map<string, string>();
  matches.forEach((m, i) => {
    const start = m.index! + m[0].length + 1; // skip marker line + its newline
    const end = i + 1 < matches.length ? matches[i + 1].index! - 2 : combined.length;
    byName.set(m[1], combined.slice(start, Math.max(start, end)));
  });
  return files.map((f) => byName.get(f.name) ?? f.starter_code);
}

export function CodePanel({
  problemId,
  code,
  onCodeChange,
  onReset,
  onRun,
  onSubmit,
  running,
  testCases,
  testResults,
  challengeType,
  stack = "python",
  files = [],
  savedCode = null,
  progressLoaded = false,
  initialHints = [],
  initialReview = null,
  initialSolution = null,
  onBadgesEarned,
}: CodePanelProps) {
  const isDjango = stack === "django";
  const isMultiFile = files.length > 0;
  const [reviewTrigger, setReviewTrigger] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [fileCodes, setFileCodes] = useState<string[]>(() =>
    files.map((f) => f.starter_code)
  );
  const restoredFor = useRef<string | null>(null);

  // Seed each file tab from starter code on navigation, then restore the
  // previously-saved combined code once progress has loaded (it arrives
  // async, after this component may have already mounted).
  useEffect(() => {
    if (files.length === 0) return;
    if (restoredFor.current === problemId) return;
    setFileCodes(files.map((f) => f.starter_code));
    setActiveFileIdx(0);
    if (!progressLoaded) return; // try again once progress resolves
    restoredFor.current = problemId;
    const restored = savedCode ? splitCombinedCode(savedCode, files) : null;
    if (restored) {
      setFileCodes(restored);
      onCodeChange(savedCode!);
    }
  }, [problemId, progressLoaded, savedCode, files, onCodeChange]);

  const handleFileCodeChange = useCallback((value: string) => {
    setFileCodes((prev) => {
      const next = [...prev];
      next[activeFileIdx] = value;
      return next;
    });
    // Also update parent code with all files concatenated for AI review
    // Format: "# --- models.py ---\n...\n# --- admin.py ---\n..."
    setFileCodes((latest) => {
      const combined = latest.map((c, i) =>
        `# --- ${files[i]?.name ?? `file${i}`} ---\n${c}`
      ).join("\n\n");
      onCodeChange(combined);
      return latest;
    });
  }, [activeFileIdx, files, onCodeChange]);

  const handleDjangoSubmit = () => {
    // Ensure combined code is up to date before triggering review
    if (isMultiFile) {
      const combined = fileCodes.map((c, i) =>
        `# --- ${files[i]?.name ?? `file${i}`} ---\n${c}`
      ).join("\n\n");
      onCodeChange(combined);
    }
    setReviewTrigger((n) => n + 1);
  };

  const handleReset = () => {
    if (isMultiFile) {
      setFileCodes(files.map((f) => f.starter_code));
      const combined = files.map((f) =>
        `# --- ${f.name} ---\n${f.starter_code}`
      ).join("\n\n");
      onCodeChange(combined);
    } else {
      onReset();
    }
  };

  // The code shown in the editor
  const editorCode = isMultiFile ? (fileCodes[activeFileIdx] ?? "") : code;
  const editorOnChange = isMultiFile ? handleFileCodeChange : onCodeChange;

  // Combined code for the bottom panel (AI review sees all files)
  const combinedCode = isMultiFile
    ? fileCodes.map((c, i) => `# --- ${files[i]?.name ?? `file${i}`} ---\n${c}`).join("\n\n")
    : code;

  return (
    <ResizablePanelGroup orientation="vertical" className="h-full">
      <ResizablePanel defaultSize={60} minSize={20}>
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 h-10 border-b border-border bg-muted/50 dark:bg-card/50 dark:border-border flex-shrink-0">
            <div className="flex items-center gap-0">
              {isMultiFile ? (
                /* Multi-file tabs */
                files.map((file, i) => (
                  <button key={file.name} onClick={() => setActiveFileIdx(i)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                      i === activeFileIdx ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                    }`}>
                    <FileCode className="w-3 h-3" />
                    {file.name}
                    {i === activeFileIdx && (
                      <motion.div layoutId="file-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                    )}
                  </button>
                ))
              ) : (
                /* Single file label */
                <>
                  <span className="text-[11px] font-medium text-muted-foreground px-2">{isDjango ? "Django" : "Python"}</span>
                  <span className="text-[10px] text-muted-foreground/40 font-mono">{isDjango ? "models.py" : "main.py"}</span>
                </>
              )}
              {challengeType === "fix-code" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-destructive/80 bg-destructive/10 px-2 py-0.5 rounded-md ml-2">
                  <Bug className="w-3 h-3" />
                  Contains bugs
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleReset}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
                title="Reset code">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              {!isDjango && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={onRun} disabled={running}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-foreground px-2.5 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-50 cursor-pointer transition-all duration-500">
                  <Play className="w-3 h-3" />
                  Run
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={isDjango ? handleDjangoSubmit : onSubmit}
                disabled={running || reviewLoading}
                className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500">
                {reviewLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                {isDjango ? (reviewLoading ? "Reviewing…" : "Submit for Review") : "Submit"}
              </motion.button>
            </div>
          </div>
          <CodeEditor code={editorCode} onChange={editorOnChange} />
        </div>
      </ResizablePanel>

      <ResizableHandle className="h-1 bg-border hover:bg-primary/30 transition-colors cursor-row-resize" />

      <ResizablePanel defaultSize={40} minSize={15}>
        <BottomPanel
          problemId={problemId} code={combinedCode}
          testCases={testCases} testResults={testResults} running={running}
          stack={stack}
          triggerReview={reviewTrigger}
          initialHints={initialHints} initialReview={initialReview}
          initialSolution={initialSolution}
          onBadgesEarned={onBadgesEarned}
          onReviewLoadingChange={setReviewLoading}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
