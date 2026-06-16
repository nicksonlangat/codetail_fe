"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArrowLeft, ChevronRight, ChevronLeft, Code, ListChecks, Bug, Wrench, Loader2 } from "lucide-react";
import { getProblem, getPathProblems, getPath, type ProblemDetail } from "@/lib/api/paths";
import { useChallenge } from "@/features/challenges/hooks/use-challenge";
import { LeftPanel } from "@/components/challenge/left-panel";
import { McqPanel } from "@/components/challenge/mcq-panel";
import { CodePanel } from "@/components/challenge/code-panel";
import type { ChallengeContent, ChallengeType } from "@/types";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { ShareModal } from "@/components/challenge/share-modal";
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

const BADGE_LABELS: Record<string, string> = {
  "first-blood":  "First Blood",
  "week-warrior": "Week Warrior",
  "debugger":     "Debugger",
  "unit-clear":   "Unit Clear",
  "pythonista":   "Pythonista",
  "architect":    "Architect",
  "path-blazer":  "Path Blazer",
  "speed-demon":  "Speed Demon",
  "django-dev":   "Django Dev",
  "the-50":       "The 50",
  "hard-mode":    "Hard Mode",
  "night-owl":    "Night Owl",
};

export default function ChallengePage() {
  const params = useParams<{ pathId: string; problemId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const handleBadgesEarned = useCallback((badges: string[], xpEarned: number) => {
    queryClient.invalidateQueries({ queryKey: ["rank"] });
    queryClient.invalidateQueries({ queryKey: ["progress", problemId] });
    queryClient.invalidateQueries({ queryKey: ["path-problems", pathSlug] });
    if (xpEarned > 0) {
      toast.success(`+${xpEarned} XP earned`, {
        description: "Keep going — you're building momentum.",
        duration: 4000,
      });
    }
    badges.forEach((id) => {
      toast.success(`Badge unlocked: ${BADGE_LABELS[id] ?? id}`, {
        description: "Check your dashboard to see all your badges.",
        duration: 5000,
      });
    });
  }, [queryClient, problemId, pathSlug]);

  const {
    code, setCode, feedbackStatus, feedback, showHints, toggleHints,
    selectedOption, setSelectedOption, mcqSubmitted, mcqSubmitting, mcqCorrect,
    mcqCorrectAnswer, mcqExplanation,
    challengeType, handleSubmit, handleReset, handleRetake, handleKeyDown,
    resetForNavigation,
  } = useChallenge({
    content,
    savedCode: progress?.code,
    initialMcqSolved: progress ? progress.status === "solved" : undefined,
    onBadgesEarned: handleBadgesEarned,
  });

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
      if (res.passed) handleBadgesEarned(res.newly_earned_badges ?? [], res.xp_earned ?? 0);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setTestResults([{ input: "", expected: "", actual: detail || "Error running code", passed: false }]);
    } finally {
      setRunning(false);
    }
  }, [problem, code, running, handleBadgesEarned]);

  const unitSiblings = useMemo(() => {
    if (!Array.isArray(siblings)) return [];
    return problem?.unit ? siblings.filter((s) => s.unit === problem.unit) : siblings;
  }, [siblings, problem?.unit]);
  const unlocked = useMemo(() => unitSiblings.filter((s) => !s.locked), [unitSiblings]);
  const hasLocked = useMemo(() => unitSiblings.some((s) => s.locked), [unitSiblings]);
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
    <div className="flex flex-col h-full bg-background" key={problemId}>
      {/* Top bar — navigation only */}
      <div className="flex items-center justify-between h-11 px-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/paths/${pathSlug}`}
            className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
            <ArrowLeft className="w-4 h-4" />
            {path?.title ?? pathSlug}
          </Link>
          {problem.unit && (
            <>
              <span className="text-muted-foreground/25 text-[13px]">/</span>
              <Link href={`/paths/${pathSlug}/${problem.unit}`}
                className="text-[12px] font-medium text-muted-foreground/60 hover:text-foreground cursor-pointer transition-all duration-500 capitalize">
                {problem.unit}
              </Link>
            </>
          )}
          {problem.is_generated && (
            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-primary/8 border-primary/20 text-primary">
              AI
            </span>
          )}
          {progress?.status && progress.status !== "not_started" && (
            <>
              <div className="w-px h-4 bg-border/40" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                    progress.status === "solved"
                      ? "bg-green-500/8 border-green-500/19 text-green-500"
                      : "bg-yellow-500/8 border-yellow-500/19 text-yellow-500"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${progress.status === "solved" ? "bg-green-500" : "bg-yellow-500"}`} />
                    {progress.status}
                  </span>
                </div>
                {progress.best_score != null && progress.best_score > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">Score</span>
                    <span className={`text-[12px] font-mono font-semibold tabular-nums ${
                      progress.best_score >= 90 ? "text-green-500"
                      : progress.best_score >= 70 ? "text-primary"
                      : progress.best_score >= 50 ? "text-yellow-500"
                      : "text-red-500"
                    }`}>
                      {progress.best_score}%
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <ShareModal problemId={problem.id} />
          <div className="w-px h-5 bg-border/40" />
          <button onClick={() => prevProblem && navigateTo(prevProblem.id)} disabled={!prevProblem}
            className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="text-[11px] text-muted-foreground/50 font-mono tabular-nums">
            {currentIdx + 1}/{unlocked.length}
          </span>
          {isLastFree ? (
            <button onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer transition-all duration-500">
              Unlock more <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={() => nextProblem && navigateTo(nextProblem.id)} disabled={!nextProblem}
              className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
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
            isGenerated={problem.is_generated ?? false}
            initialNotes={progress?.notes ?? null}
          />
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-primary/30 transition-colors cursor-col-resize" />

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
              testCases={problem.test_cases ?? []}
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

