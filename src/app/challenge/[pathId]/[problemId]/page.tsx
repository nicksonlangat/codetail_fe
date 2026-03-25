"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArrowLeft, ChevronRight, ChevronLeft, Code, ListChecks, Bug, Wrench, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { getProblem, getPathProblems, getPath, type ProblemDetail } from "@/lib/api/paths";
import { useChallenge } from "@/features/challenges/hooks/use-challenge";
import { LeftPanel } from "@/components/challenge/left-panel";
import { McqPanel } from "@/components/challenge/mcq-panel";
import { CodePanel } from "@/components/challenge/code-panel";
import type { ChallengeContent, ChallengeType } from "@/types";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { runCode, getReview } from "@/lib/api/submissions";
import { getProgress } from "@/lib/api/progress";
import type { TestCaseResult } from "@/components/challenge/test-cases-panel";

const typeConfig: Record<string, { icon: typeof Code; label: string }> = {
  write_code: { icon: Code, label: "Write Code" },
  mcq: { icon: ListChecks, label: "Multiple Choice" },
  fix_code: { icon: Bug, label: "Fix the Code" },
  refactor: { icon: Wrench, label: "Refactor" },
};

function apiToContent(p: ProblemDetail): ChallengeContent {
  const typeMap: Record<string, ChallengeType> = {
    write_code: "code",
    mcq: "mcq",
    fix_code: "fix-code",
    refactor: "code",
  };
  return {
    problemId: p.id,
    title: p.title,
    type: typeMap[p.type] ?? "code",
    description: p.description,
    functionSignature: p.function_signature ?? "",
    examples: (p.examples ?? []).map((e) => ({ input: e.input, output: e.output, explanation: e.explanation ?? undefined })),
    starterCode: p.starter_code,
    options: (p.mcq_options ?? []).map((o) => ({ id: o.id, label: o.label, code: o.code ?? undefined })),
    correctOptionId: undefined,
    explanation: p.explanation ?? undefined,
    issueDescription: p.issue_description ?? undefined,
  };
}

export default function ChallengePage() {
  const params = useParams<{ pathId: string; problemId: string }>();
  const router = useRouter();
  const { pathId: pathSlug, problemId } = params;

  const { data: problem, isLoading: problemLoading } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => getProblem(problemId),
  });

  const { data: path } = useQuery({
    queryKey: ["path", pathSlug],
    queryFn: () => getPath(pathSlug),
    enabled: !!pathSlug,
  });

  const { data: siblings } = useQuery({
    queryKey: ["path-problems", pathSlug],
    queryFn: () => getPathProblems(pathSlug),
    enabled: !!pathSlug,
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", problemId],
    queryFn: () => getProgress(problemId),
    enabled: !!problemId,
  });

  const content = useMemo(() => problem ? apiToContent(problem) : undefined, [problem]);

  const {
    code, setCode, feedbackStatus, feedback, showHints, toggleHints,
    selectedOption, setSelectedOption, mcqSubmitted, mcqSubmitting, mcqCorrect,
    mcqCorrectAnswer, mcqExplanation,
    challengeType, handleSubmit, handleReset, handleRetake, handleKeyDown,
    resetForNavigation,
  } = useChallenge({ content, savedCode: progress?.code });

  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);

  useEffect(() => {
    if (progress?.last_run_results?.length && !resultsLoaded) {
      setTestResults(progress.last_run_results.map((r) => ({ input: r.input, expected: r.expected, actual: r.actual, passed: r.passed })));
      setResultsLoaded(true);
    }
  }, [progress, resultsLoaded]);
  const [running, setRunning] = useState(false);

  const isDjango = problem?.stack === "django";

  const handleRun = useCallback(async () => {
    if (!problem || running) return;
    setRunning(true);
    setTestResults([]);
    try {
      const res = await runCode(problem.id, code);
      setTestResults(res.test_results.map((tr) => ({
        input: tr.input,
        expected: tr.expected,
        actual: tr.actual,
        passed: tr.passed,
      })));
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setTestResults([{ input: "", expected: "", actual: detail || "Error running code", passed: false }]);
    } finally {
      setRunning(false);
    }
  }, [problem, code, running]);

  const unlocked = useMemo(() => Array.isArray(siblings) ? siblings.filter((s) => !s.locked) : [], [siblings]);
  const hasLocked = useMemo(() => Array.isArray(siblings) ? siblings.some((s) => s.locked) : false, [siblings]);
  const currentIdx = unlocked.findIndex((p) => p.id === problemId);
  const prevProblem = currentIdx > 0 ? unlocked[currentIdx - 1] : null;
  const nextProblem = currentIdx >= 0 && currentIdx < unlocked.length - 1 ? unlocked[currentIdx + 1] : null;
  const isLastFree = currentIdx === unlocked.length - 1 && hasLocked;

  const [showUpgrade, setShowUpgrade] = useState(false);

  const navigateTo = (id: string) => {
    resetForNavigation();
    router.push(`/challenge/${pathSlug}/${id}`);
  };

  if (problemLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!problem || !content) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <p className="text-[13px] text-muted-foreground">Problem not found.</p>
      </div>
    );
  }

  const tc = typeConfig[problem.type] ?? typeConfig.write_code;
  const TypeIcon = tc.icon;
  const diffColor = problem.difficulty === "easy"
    ? "text-difficulty-easy" : problem.difficulty === "medium"
    ? "text-difficulty-medium" : "text-difficulty-hard";

  return (
    <div className="flex flex-col h-screen bg-background" key={problemId}>
      {/* Top bar — navigation only */}
      <div className="flex items-center justify-between h-10 px-6 border-b border-border/60 bg-card/50 flex-shrink-0">
        <Link href={`/paths/${pathSlug}`}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
          <ArrowLeft className="w-3 h-3" />
          {path?.title ?? pathSlug}
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={() => prevProblem && navigateTo(prevProblem.id)} disabled={!prevProblem}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <div className="flex items-center gap-1 px-1">
            {unlocked.map((p, i) => (
              <button key={p.id} onClick={() => navigateTo(p.id)} title={`${i + 1}. ${p.title}`}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${
                  p.id === problemId ? "bg-primary scale-125" : i < currentIdx ? "bg-primary/40" : "bg-border"
                }`} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
            {currentIdx + 1}/{unlocked.length}
          </span>
          {isLastFree ? (
            <button onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer transition-all duration-500">
              Unlock more <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <button onClick={() => nextProblem && navigateTo(nextProblem.id)} disabled={!nextProblem}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
              Next <ChevronRight className="w-3 h-3" />
            </button>
          )}
          <div className="w-px h-4 bg-border/40 mx-1" />
          <ThemeToggle />
        </div>
      </div>

      {/* Main */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={50} minSize={25}>
          <LeftPanel
            content={content}
            meta={{ title: problem.title, difficulty: problem.difficulty, type: problem.type, concept: problem.concept }}
            showHints={showHints}
            onToggleHints={toggleHints}
          />
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border/40 hover:bg-primary/30 transition-colors cursor-col-resize" />

        <ResizablePanel defaultSize={50} minSize={25}>
          {challengeType === "mcq" ? (
            <McqPanel
              content={{
                ...content,
                correctOptionId: mcqCorrectAnswer ?? undefined,
                explanation: mcqExplanation ?? content.explanation,
              }}
              selectedOption={selectedOption} onSelect={setSelectedOption}
              mcqSubmitted={mcqSubmitted} mcqSubmitting={mcqSubmitting}
              mcqCorrect={mcqCorrect} handleSubmit={handleSubmit}
              handleRetake={handleRetake} nextProblem={nextProblem} navigateTo={navigateTo} />
          ) : (
            <CodePanel problemId={problem.id} code={code} onCodeChange={setCode}
              onReset={handleReset} onRun={handleRun} onSubmit={handleRun}
              running={running}
              examples={content.examples ?? []}
              testResults={testResults}
              challengeType={challengeType}
              stack={problem.stack}
              files={problem.files ?? []}
              initialHints={progress?.saved_hints ?? []}
              initialReview={progress?.last_review ?? null}
              initialSolution={progress?.last_solution ?? null} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="You've completed all free problems in this path. Upgrade to Pro to unlock the rest."
      />
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
    >
      <Sun className="w-3.5 h-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-3.5 h-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
