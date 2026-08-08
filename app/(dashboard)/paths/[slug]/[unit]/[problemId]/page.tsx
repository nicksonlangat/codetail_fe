"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChallengeHeader } from "@/components/challenge/challenge-header";
import { LeftPanel } from "@/components/challenge/left-panel";
import { CodePanel } from "@/components/challenge/code-panel";
import { McqPanel } from "@/components/challenge/mcq-panel";
import { SolvedBanner } from "@/components/challenge/solved-banner";
import { useProblem, useProgress } from "@/lib/queries/use-problem";
import { usePath, usePathProblems } from "@/lib/queries/use-paths";
import { pathKeys, progressKeys, userKeys, leaderboardKeys } from "@/lib/queries/keys";
import { saveProgress } from "@/lib/api/progress";
import { getErrorMessage } from "@/lib/api/client";
import type { ProblemDetail } from "@/lib/api/problems";
import type { ProblemProgress } from "@/lib/api/progress";

const colHandle =
  "w-[3px] bg-brand-border hover:bg-brand-primary cursor-col-resize transition-all duration-500 shrink-0";
const NOTES_AUTOSAVE_DELAY_MS = 1200;

export default function ChallengePage() {
  const { slug, unit, problemId } = useParams<{ slug: string; unit: string; problemId: string }>();

  const { data: problem, isLoading: problemLoading, isError, error } = useProblem(problemId);
  const { data: progress, isLoading: progressLoading } = useProgress(problemId);
  const { data: path } = usePath(slug);
  const { data: unitProblems } = usePathProblems(slug, unit);

  const orderedUnitProblems = useMemo(
    () =>
      (unitProblems ?? [])
        .filter((p) => !p.is_generated)
        .sort((a, b) => a.sort_order - b.sort_order),
    [unitProblems]
  );
  const currentIndex = orderedUnitProblems.findIndex((p) => p.id === problemId);

  if (isError) {
    return (
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <p className="text-sm text-brand-text-muted mb-3">
            {getErrorMessage(error, "Couldn't load this problem.")}
          </p>
          <Link
            href={`/paths/${slug}/${unit}`}
            className="text-sm font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover"
          >
            Back to unit
          </Link>
        </div>
      </div>
    );
  }

  if (problemLoading || progressLoading || !problem) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="size-6 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ChallengeContent
      problem={problem}
      progress={progress ?? null}
      pathSlug={slug}
      pathTitle={path?.title ?? "Path"}
      unitSlug={unit}
      index={currentIndex >= 0 ? currentIndex + 1 : 1}
      total={orderedUnitProblems.length || 1}
      prevProblemId={currentIndex > 0 ? orderedUnitProblems[currentIndex - 1].id : null}
      nextProblemId={
        currentIndex >= 0 && currentIndex < orderedUnitProblems.length - 1
          ? orderedUnitProblems[currentIndex + 1].id
          : null
      }
    />
  );
}

interface ChallengeContentProps {
  problem: ProblemDetail;
  progress: ProblemProgress | null;
  pathSlug: string;
  pathTitle: string;
  unitSlug: string;
  index: number;
  total: number;
  prevProblemId: string | null;
  nextProblemId: string | null;
}

// Only mounted once the problem and progress queries have both resolved
// (see ChallengePage above), so `notes` seeds correctly from the real
// initial value on first render — no effect syncing it in later, which
// would risk clobbering an in-progress edit if `progress` ever refetches
// (e.g. after a solve, see handleSolved's invalidateQueries calls).
function ChallengeContent({
  problem,
  progress,
  pathSlug,
  pathTitle,
  unitSlug,
  index,
  total,
  prevProblemId,
  nextProblemId,
}: ChallengeContentProps) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(progress?.notes ?? "");
  const [solved, setSolved] = useState<{ xp: number; badges: string[] } | null>(null);

  const isFirstNotesRender = useRef(true);
  useEffect(() => {
    if (isFirstNotesRender.current) {
      isFirstNotesRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      saveProgress(problem.id, { notes }).catch(() => {
        // Best-effort, same as code autosave — never interrupt the user.
      });
    }, NOTES_AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [notes, problem.id]);

  function handleSolved(xpEarned: number, badges: string[]) {
    setSolved({ xp: xpEarned, badges });
    // Solving this problem can move the ring on the unit page, the path
    // header, the dashboard, and the leaderboard/rank sidebar — all of
    // which have their own cached queries that are now stale.
    queryClient.invalidateQueries({ queryKey: progressKeys.detail(problem.id) });
    queryClient.invalidateQueries({ queryKey: pathKeys.problems(pathSlug, unitSlug) });
    queryClient.invalidateQueries({ queryKey: pathKeys.units(pathSlug) });
    queryClient.invalidateQueries({ queryKey: progressKeys.dashboard });
    queryClient.invalidateQueries({ queryKey: userKeys.rank });
    queryClient.invalidateQueries({ queryKey: leaderboardKeys.weekly });
  }

  return (
    // AppTopbar renders nothing on this route (see app-topbar.tsx's
    // isChallengePage check), so this page owns the full viewport height.
    <div className="w-full flex flex-col h-screen overflow-hidden">
      <ChallengeHeader
        pathSlug={pathSlug}
        pathTitle={pathTitle}
        unitSlug={unitSlug}
        unitLabel={unitSlug.replace(/-/g, " ")}
        problemTitle={problem.title}
        index={index}
        total={total}
        prevProblemId={prevProblemId}
        nextProblemId={nextProblemId}
      />

      <AnimatePresence>
        {solved && (
          <SolvedBanner
            xpEarned={solved.xp}
            badges={solved.badges}
            onDismiss={() => setSolved(null)}
          />
        )}
      </AnimatePresence>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={45} minSize={28}>
          <LeftPanel problem={problem} notes={notes} onNotesChange={setNotes} />
        </ResizablePanel>

        <ResizableHandle className={colHandle} />

        <ResizablePanel defaultSize={55} minSize={30}>
          {problem.type === "mcq" ? (
            <McqPanel
              problemId={problem.id}
              options={problem.mcq_options}
              initialSelected={progress?.mcq_selected_answer ?? null}
              alreadySolved={progress?.status === "solved"}
              explanation={problem.explanation}
              onSolved={handleSolved}
            />
          ) : (
            <CodePanel problem={problem} progress={progress} onSolved={handleSolved} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
