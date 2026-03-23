"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Code,
  ListChecks,
  Bug,
} from "lucide-react";
import type { ChallengeType } from "@/types";
import { getPathById, getProblemById } from "@/data/paths";
import { challengeContent } from "@/data/challenges";
import { useChallenge } from "@/features/challenges/hooks/use-challenge";
import { ProblemDescription } from "@/components/challenge/problem-description";
import { McqPanel } from "@/components/challenge/mcq-panel";
import { CodePanel } from "@/components/challenge/code-panel";

const typeLabel: Record<ChallengeType, { icon: typeof Code; label: string }> = {
  code: { icon: Code, label: "Write Code" },
  mcq: { icon: ListChecks, label: "Multiple Choice" },
  "fix-code": { icon: Bug, label: "Fix the Code" },
};

export default function ChallengePage() {
  const params = useParams<{ pathId: string; problemId: string }>();
  const router = useRouter();
  const { pathId, problemId } = params;

  const path = useMemo(() => getPathById(pathId), [pathId]);
  const problem = useMemo(
    () => getProblemById(pathId, problemId),
    [pathId, problemId],
  );
  const content = useMemo(
    () => (problemId ? challengeContent[problemId] : undefined),
    [problemId],
  );

  const {
    code,
    setCode,
    feedbackStatus,
    feedback,
    showHints,
    toggleHints,
    selectedOption,
    setSelectedOption,
    mcqSubmitted,
    mcqCorrect,
    challengeType,
    handleSubmit,
    handleReset,
    handleRetake,
    handleKeyDown,
    resetForNavigation,
  } = useChallenge({ content });

  const currentIdx = path?.problems.findIndex((p) => p.id === problemId) ?? -1;
  const prevProblem =
    path && currentIdx > 0 ? path.problems[currentIdx - 1] : null;
  const nextProblem =
    path && currentIdx >= 0 && currentIdx < path.problems.length - 1
      ? path.problems[currentIdx + 1]
      : null;
  const totalProblems = path?.problems.length ?? 0;

  const navigateTo = (id: string) => {
    resetForNavigation();
    router.push(`/challenge/${pathId}/${id}`);
  };

  if (!path || !problem) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <p className="text-sm text-muted-foreground">Challenge not found.</p>
      </div>
    );
  }

  const TypeIcon = typeLabel[challengeType].icon;

  return (
    <div className="flex flex-col h-screen bg-background" key={problemId}>
      {/* Top bar */}
      <div className="flex items-center justify-between h-11 px-4 border-b border-border/60 bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/paths/${pathId}`}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-75"
          >
            <ArrowLeft className="w-3 h-3" />
            {path.title}
          </Link>
          <div className="w-px h-4 bg-border/40" />
          <span className="text-[13px] font-medium text-foreground">
            {content?.title ?? problem.title}
          </span>
          <span
            className={`text-[10px] font-medium ${
              problem.difficulty === "Easy"
                ? "text-difficulty-easy"
                : problem.difficulty === "Medium"
                  ? "text-difficulty-medium"
                  : "text-difficulty-hard"
            }`}
          >
            {problem.difficulty}
          </span>
          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground/70 font-medium">
            <TypeIcon className="w-2.5 h-2.5" />
            {typeLabel[challengeType].label}
          </span>
        </div>

        <NavigationDots
          problems={path.problems}
          currentId={problemId}
          currentIdx={currentIdx}
          totalProblems={totalProblems}
          prevProblem={prevProblem}
          nextProblem={nextProblem}
          navigateTo={navigateTo}
        />

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground/60 font-mono">
            {problem.concept}
          </span>
        </div>
      </div>

      {/* Main content */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        <ResizablePanel
          defaultSize={challengeType === "mcq" ? 40 : 35}
          minSize={20}
          maxSize={70}
        >
          {content && (
            <ProblemDescription
              content={content}
              showHints={showHints}
              onToggleHints={toggleHints}
            />
          )}
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-border/40 hover:bg-primary/20 transition-colors duration-150"
        />

        <ResizablePanel
          defaultSize={challengeType === "mcq" ? 60 : 65}
          minSize={35}
        >
          {challengeType === "mcq" ? (
            <McqPanel
              content={content}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
              mcqSubmitted={mcqSubmitted}
              mcqCorrect={mcqCorrect}
              handleSubmit={handleSubmit}
              handleRetake={handleRetake}
              nextProblem={nextProblem}
              navigateTo={navigateTo}
            />
          ) : (
            <CodePanel
              code={code}
              onCodeChange={setCode}
              onKeyDown={handleKeyDown}
              onReset={handleReset}
              onSubmit={handleSubmit}
              feedbackStatus={feedbackStatus}
              feedback={feedback}
              challengeType={challengeType}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

/* ── Navigation dots ── */

function NavigationDots({
  problems,
  currentId,
  currentIdx,
  totalProblems,
  prevProblem,
  nextProblem,
  navigateTo,
}: {
  problems: { id: string; title: string }[];
  currentId: string;
  currentIdx: number;
  totalProblems: number;
  prevProblem: { id: string } | null;
  nextProblem: { id: string } | null;
  navigateTo: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => prevProblem && navigateTo(prevProblem.id)}
        disabled={!prevProblem}
        className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-75"
      >
        <ChevronLeft className="w-3 h-3" />
        Prev
      </button>
      <div className="flex items-center gap-1 px-2">
        {problems.map((prob, i) => (
          <button
            key={prob.id}
            onClick={() => navigateTo(prob.id)}
            title={`${i + 1}. ${prob.title}`}
            className={`w-2 h-2 rounded-full transition-all duration-150 ${
              prob.id === currentId
                ? "bg-primary scale-125"
                : i < currentIdx
                  ? "bg-primary/40"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
        {currentIdx + 1}/{totalProblems}
      </span>
      <button
        onClick={() => nextProblem && navigateTo(nextProblem.id)}
        disabled={!nextProblem}
        className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-75"
      >
        Next
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
