"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Lightbulb, WandSparkles, BookOpen, RotateCcw, Play, Send, Loader2,
} from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";
import { runCode } from "@/lib/api/submissions";
import { saveProgress } from "@/lib/api/progress";
import { getErrorMessage } from "@/lib/api/client";
import { TestCasesPanel } from "./test-cases-panel";
import { HintsPanel } from "./hints-panel";
import { ReviewPanel } from "./review-panel";
import { SolutionPanel } from "./solution-panel";
import type { ProblemDetail } from "@/lib/api/problems";
import type { TestResult } from "@/lib/api/submissions";
import type { ProblemProgress } from "@/lib/api/progress";
import type { ReviewDisplay } from "./review-panel";

const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const AUTOSAVE_DELAY_MS = 1000;

const rowHandle =
  "h-[3px] bg-brand-border hover:bg-brand-primary cursor-row-resize transition-all duration-500 shrink-0";

const BOTTOM_TABS = [
  { id: "tests", label: "Test Cases", icon: FlaskConical },
  { id: "hints", label: "Hints", icon: Lightbulb },
  { id: "review", label: "AI Review", icon: WandSparkles },
  { id: "solution", label: "Solution", icon: BookOpen },
] as const;

type BottomTab = (typeof BOTTOM_TABS)[number]["id"];

interface CodePanelProps {
  problem: ProblemDetail;
  progress: ProblemProgress | null;
  onSolved: (xpEarned: number, badges: string[]) => void;
}

export function CodePanel({ problem, progress, onSolved }: CodePanelProps) {
  const [code, setCode] = useState(progress?.code ?? problem.starter_code);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(
    progress?.last_run_results?.length ? progress.last_run_results : null
  );
  const [runError, setRunError] = useState<string | null>(null);
  const [bottomTab, setBottomTab] = useState<BottomTab>("tests");

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      saveProgress(problem.id, { code }).catch(() => {
        // Autosave is best-effort — a failed save here shouldn't interrupt
        // typing. The next successful save (or an explicit Run/Submit,
        // which persists code as a side effect) will catch up.
      });
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [code, problem.id]);

  async function handleRun() {
    setRunning(true);
    setRunError(null);
    setBottomTab("tests");
    try {
      const result = await runCode(problem.id, code);
      setTestResults(result.test_results);
      if (result.passed && result.xp_earned > 0) {
        onSolved(result.xp_earned, result.newly_earned_badges);
      }
    } catch (err) {
      setRunError(getErrorMessage(err, "Something went wrong running your code."));
      setTestResults(null);
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    if (code !== problem.starter_code && !window.confirm("Discard your changes and reset to the starter code?")) {
      return;
    }
    setCode(problem.starter_code);
    setTestResults(null);
    setRunError(null);
  }

  return (
    <ResizablePanelGroup orientation="vertical" className="h-full">
      <ResizablePanel defaultSize={55} minSize={25}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between h-11 px-4 border-b border-brand-border shrink-0">
            <span className="text-xs text-brand-text">
              <span className="text-brand-text-muted capitalize">{problem.stack}</span> main.py
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reset to starter code"
                className="p-1.5 rounded-lg text-brand-text-muted cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1 rounded-lg border border-brand-border-strong text-brand-text-muted text-[11px] font-medium px-2.5 py-1.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface disabled:cursor-default disabled:opacity-60"
              >
                {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                Run
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-primary text-white text-[11px] font-medium px-2.5 py-1.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
              >
                {running ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                Submit
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <MonacoCodeEditor value={code} onChange={setCode} language="python" />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle className={rowHandle} />

      <ResizablePanel defaultSize={45} minSize={20}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-5 h-10 px-4 border-b border-brand-border shrink-0">
            {BOTTOM_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setBottomTab(id)}
                className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer outline-none transition-all duration-500 ${
                  bottomTab === id ? "text-brand-text" : "text-brand-text-muted hover:text-brand-text"
                }`}
              >
                <Icon className="size-3.5" /> {label}
                {bottomTab === id && (
                  <motion.span
                    layoutId="challenge-bottom-tab-underline"
                    transition={TAB_SPRING}
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {bottomTab === "tests" && (
                <motion.div
                  key="tests"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={TAB_SPRING}
                >
                  <TestCasesPanel
                    testCases={problem.test_cases}
                    results={testResults}
                    error={runError}
                  />
                </motion.div>
              )}
              {bottomTab === "hints" && (
                <motion.div
                  key="hints"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={TAB_SPRING}
                >
                  <HintsPanel
                    problemId={problem.id}
                    code={code}
                    initialHints={progress?.saved_hints ?? []}
                  />
                </motion.div>
              )}
              {bottomTab === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={TAB_SPRING}
                >
                  <ReviewPanel
                    problemId={problem.id}
                    code={code}
                    initialReview={(progress?.last_review as ReviewDisplay | null) ?? null}
                    onSolved={onSolved}
                  />
                </motion.div>
              )}
              {bottomTab === "solution" && (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={TAB_SPRING}
                  className="h-full"
                >
                  <SolutionPanel
                    problemId={problem.id}
                    initialSolution={progress?.last_solution ?? null}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
