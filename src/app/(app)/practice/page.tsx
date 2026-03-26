"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, RotateCcw, Clock, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { generatePractice, getPracticeHistory } from "@/lib/api/submissions";
import type { ProblemDetail, ProblemFile } from "@/lib/api/paths";
import { CodePanel } from "@/components/challenge/code-panel";
import { LeftPanel } from "@/components/challenge/left-panel";
import type { ChallengeContent, ChallengeType } from "@/types";
import type { TestCaseResult } from "@/components/challenge/test-cases-panel";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const STACKS = [
  { id: "django", label: "Django" },
  { id: "python", label: "Python" },
];

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

const TYPES = [
  { id: "write_code", label: "Write Code" },
  { id: "fix_code", label: "Fix Code" },
  { id: "refactor", label: "Refactor" },
  { id: "mcq", label: "MCQ" },
];

const CONCEPTS: Record<string, string[]> = {
  django: [
    "Models", "Fields", "Relationships", "Managers", "QuerySets",
    "Views", "URLs", "Templates", "Forms", "Middleware", "Signals",
    "Serializers", "ViewSets", "Permissions", "Authentication", "Filtering",
    "Clean Architecture",
  ],
  python: [
    "Functions", "Data Structures", "Comprehensions", "Generators",
    "OOP", "Decorators", "Async", "Error Handling", "File I/O",
  ],
};

function apiToContent(p: ProblemDetail): ChallengeContent {
  const typeMap: Record<string, ChallengeType> = {
    write_code: "code", mcq: "mcq", fix_code: "fix-code", refactor: "code",
  };
  return {
    problemId: p.id,
    title: p.title,
    type: typeMap[p.type] ?? "code",
    description: p.description,
    functionSignature: p.function_signature ?? "",
    examples: (p.examples ?? []).map((e) => ({
      input: e.input, output: e.output, explanation: e.explanation ?? undefined,
    })),
    starterCode: p.starter_code,
    options: (p.mcq_options ?? []).map((o) => ({
      id: o.id, label: o.label, code: o.code ?? undefined,
    })),
    issueDescription: p.issue_description ?? undefined,
  };
}

const diffColor: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

export default function PracticePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [stack, setStack] = useState("django");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [problemType, setProblemType] = useState("write_code");
  const [concept, setConcept] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ["practice-history", stack],
    queryFn: () => getPracticeHistory(stack),
  });

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    setProblem(null);
    try {
      const result = await generatePractice({
        stack,
        difficulty,
        problem_type: problemType,
        concept: concept ?? undefined,
      });
      setProblem(result);
      setCode(result.starter_code);
      refetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate problem");
    } finally {
      setGenerating(false);
    }
  }, [stack, difficulty, problemType, concept, refetchHistory]);

  const handleReset = useCallback(() => {
    if (problem) setCode(problem.starter_code);
  }, [problem]);

  const content = problem ? apiToContent(problem) : undefined;

  // If we have a generated problem, show the challenge UI
  if (problem && content) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between h-10 px-6 border-b border-border/60 bg-card/50 flex-shrink-0">
          <button onClick={() => setProblem(null)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
            <RotateCcw className="w-3 h-3" /> New Problem
          </button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[13px] font-medium">{problem.title}</span>
            <span className={`text-[10px] font-medium ${diffColor[problem.difficulty] ?? ""}`}>{problem.difficulty}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{problem.concept}</span>
          </div>
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500">
            <Sun className="w-3.5 h-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-3.5 h-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>

        <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={45} minSize={25}>
            <LeftPanel
              content={content}
              meta={{ title: problem.title, difficulty: problem.difficulty, type: problem.type, concept: problem.concept }}
              showHints={false}
              onToggleHints={() => {}}
            />
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-border/40 hover:bg-primary/30 transition-colors cursor-col-resize" />
          <ResizablePanel defaultSize={55} minSize={25}>
            <CodePanel
              problemId={problem.id}
              code={code}
              onCodeChange={setCode}
              onReset={handleReset}
              onRun={() => {}}
              onSubmit={() => {}}
              running={false}
              examples={content.examples ?? []}
              testResults={[] as TestCaseResult[]}
              challengeType={content.type}
              stack={problem.stack}
              files={problem.files ?? []}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // Picker UI
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between h-10 px-6 border-b border-border/60 bg-card/50 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[13px] font-medium">Practice Mode</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Pro</span>
        </div>
        <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500">
          <Sun className="w-3.5 h-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-3.5 h-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">AI Practice</h1>
            <p className="text-[13px] text-muted-foreground">Generate fresh problems tailored to what you want to drill. Every problem is unique.</p>
          </div>

          {/* Picker */}
          <div className="space-y-5">
            {/* Stack */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Stack</label>
              <div className="flex gap-2 mt-2">
                {STACKS.map((s) => (
                  <button key={s.id} onClick={() => { setStack(s.id); setConcept(null); }}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg cursor-pointer transition-all duration-500 ${
                      stack === s.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Difficulty</label>
              <div className="flex gap-2 mt-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg cursor-pointer transition-all duration-500 ${
                      difficulty === d ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Problem Type</label>
              <div className="flex gap-2 mt-2">
                {TYPES.map((t) => (
                  <button key={t.id} onClick={() => setProblemType(t.id)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg cursor-pointer transition-all duration-500 ${
                      problemType === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Concept (optional) */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Concept <span className="text-muted-foreground/40">(optional)</span></label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(CONCEPTS[stack] ?? []).map((c) => (
                  <button key={c} onClick={() => setConcept(concept === c ? null : c)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all duration-500 ${
                      concept === c ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <motion.button whileTap={{ scale: 0.97 }} transition={spring} onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 text-[13px] font-medium text-primary-foreground px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate Problem"}
          </motion.button>

          {error && (
            <p className="text-[12px] text-destructive">{error}</p>
          )}

          {/* History */}
          {history && history.items.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Recent Practice</h2>
              <div className="space-y-1.5">
                {history.items.map((item) => (
                  <Link key={item.id} href={`/challenge/practice-${item.stack}/${item.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-all duration-500 group">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium ${diffColor[item.difficulty] ?? ""}`}>{item.difficulty}</span>
                      <span className="text-[12px] font-medium text-foreground">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground">{item.concept}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.best_score !== null && (
                        <span className={`text-[10px] font-mono font-medium ${
                          item.best_score >= 90 ? "text-green-500"
                          : item.best_score >= 70 ? "text-primary"
                          : "text-yellow-600"
                        }`}>{item.best_score}</span>
                      )}
                      <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-foreground transition-all duration-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
