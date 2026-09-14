"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Check, XCircle, Play, FlaskConical, WandSparkles, RotateCcw, StickyNote, FileText, Lightbulb, BookOpen } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";
import { NotesEditor } from "@/components/editors/notes-editor";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { PROSE_CLASS } from "@/components/challenge/prose-styles";
import { Spinner } from "@/components/ui/spinner";
import { useProject } from "@/lib/queries/use-projects";
import { startProject, saveProjectCode, submitProject } from "@/lib/api/projects";
import { useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/queries/keys";
import type { TestResultItem, ProjectSubmitResult, ProjectTestCase } from "@/lib/api/projects";
import type { ProjectMode, ProjectTier } from "@/lib/api/types";

const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const AUTOSAVE_MS = 1000;

const TIER_COLOR: Record<ProjectTier, string> = {
  utility:   "text-brand-success bg-brand-success/10 border-brand-success/20",
  component: "text-brand-sky bg-brand-sky/10 border-brand-sky/20",
  system:    "text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/20",
  incident:  "text-brand-destructive bg-brand-destructive/10 border-brand-destructive/20",
};

const MODE_COLOR: Record<ProjectMode, string> = {
  build: "text-brand-text-muted bg-brand-surface",
  fix:   "text-brand-warning bg-brand-warning/10",
  debug: "text-brand-destructive bg-brand-destructive/10",
};

const colHandle = "w-[3px] bg-brand-border hover:bg-brand-primary cursor-col-resize transition-all duration-500 shrink-0";

const BOTTOM_TABS = [
  { id: "results", label: "Test Results", icon: FlaskConical },
  { id: "hints",   label: "Hints",        icon: Lightbulb    },
  { id: "review",  label: "AI Review",    icon: WandSparkles },
  { id: "solution",label: "Solution",     icon: BookOpen     },
] as const;

type LeftTab   = "instructions" | "notes";
type BottomTab = (typeof BOTTOM_TABS)[number]["id"];

function ProjectHeader({ ticketId, repo, title, tier, mode, minutes, completed }: {
  ticketId: string; repo: string; title: string;
  tier: ProjectTier; mode: ProjectMode; minutes: number; completed: boolean;
}) {
  return (
    <div className="flex items-center justify-between h-14 px-5 border-b border-brand-border shrink-0 bg-white">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <Link href="/dashboard" className="font-semibold text-brand-text shrink-0 hover:text-brand-primary transition-all duration-500 outline-none cursor-pointer">
          Code<span className="text-brand-primary">tail</span>
        </Link>
        <ChevronRight className="size-3.5 text-brand-text-subtle shrink-0" />
        <Link href="/projects" className="text-brand-text-muted hover:text-brand-text transition-all duration-500 outline-none cursor-pointer shrink-0">
          Projects
        </Link>
        <ChevronRight className="size-3.5 text-brand-text-subtle shrink-0" />
        <span className="font-mono text-[11px] text-brand-text-subtle shrink-0">#{ticketId}</span>
        <span className="font-medium text-brand-text truncate">{title}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${MODE_COLOR[mode]}`}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${TIER_COLOR[tier]}`}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-brand-text-subtle">
          <Clock className="size-3" />{minutes} min
        </span>
        {completed && (
          <span className="flex items-center gap-1 text-[11px] text-brand-success font-medium">
            <CheckCircle2 className="size-3.5" /> Completed
          </span>
        )}
        <Link href="/projects" className="flex items-center gap-1 text-[12px] text-brand-text-muted hover:text-brand-text border border-brand-border-strong rounded-lg px-2.5 py-1.5 transition-all duration-500 cursor-pointer outline-none">
          <ChevronLeft className="size-3.5" /> Projects
        </Link>
      </div>
    </div>
  );
}

function InstructionsPanel({ html }: { html: string }) {
  return (
    <div className="px-6 py-5">
      <TipTapRenderer content={html} className={PROSE_CLASS} />
    </div>
  );
}

function TestResultsPanel({ testCases, results }: { testCases: ProjectTestCase[]; results: TestResultItem[] | null }) {
  const passedCount = results?.filter((r) => r.passed).length ?? 0;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-brand-text">Test Cases</p>
        {results && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${passedCount === results.length ? "text-brand-primary" : "text-brand-destructive"}`}>
            {passedCount === results.length ? (
              <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-brand-primary">
                <Check className="size-2 text-white" strokeWidth={3} />
              </span>
            ) : (
              <XCircle className="size-3.5" />
            )}
            {passedCount} / {results.length} passed
          </span>
        )}
      </div>
      <div className="divide-y divide-brand-border">
        {testCases.map((test, i) => {
          const result = results?.[i];
          return (
            <div key={i} className="flex gap-3 py-2.5 text-[12.5px]">
              <span className="shrink-0 mt-0.5">
                {result ? (
                  result.passed ? (
                    <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-brand-primary">
                      <Check className="size-2 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <XCircle className="size-3.5 text-brand-destructive" />
                  )
                ) : (
                  <span className="text-brand-text-subtle">&middot;</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-text">Test {i + 1}</p>
                <p className="font-mono text-brand-text-muted truncate">Input: {test.input}</p>
                <p className="font-mono text-brand-text-muted truncate">Expected: {test.expected}</p>
                {result && (
                  <p className={`font-mono truncate ${result.passed ? "text-brand-primary" : "text-brand-destructive"}`}>
                    Got: {result.actual}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewPanel({ review }: { review: Record<string, unknown> | null }) {
  if (!review) {
    return (
      <div className="flex items-center justify-center h-full text-[12px] text-brand-text-subtle">
        Submit your code to receive a review.
      </div>
    );
  }

  const score = review.score as number;
  const passed = score >= 70;

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto">
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-brand-border text-[12px] font-medium ${passed ? "text-brand-success" : "text-brand-destructive"}`}>
        {passed ? <CheckCircle2 className="size-3.5" /> : <FlaskConical className="size-3.5" />}
        {passed ? "Passed review" : "Needs work"}
        <span className="ml-auto text-brand-text-subtle font-normal">{score}/100</span>
      </div>

      {review.summary && (
        <div className="px-4 py-3 border-b border-brand-border text-[12px] text-brand-text-muted italic">
          {review.summary as string}
        </div>
      )}

      {(review.issues as string[] | undefined)?.length > 0 && (
        <div className="px-4 py-3 border-b border-brand-border flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-brand-destructive uppercase tracking-wider">Issues</p>
          {(review.issues as string[]).map((issue, i) => (
            <p key={i} className="text-[12px] text-brand-text-muted">· {issue}</p>
          ))}
        </div>
      )}

      {(review.suggestions as string[] | undefined)?.length > 0 && (
        <div className="px-4 py-3 border-b border-brand-border flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">Suggestions</p>
          {(review.suggestions as string[]).map((s, i) => (
            <p key={i} className="text-[12px] text-brand-text-muted">· {s}</p>
          ))}
        </div>
      )}

      {(review.strengths as string[] | undefined)?.length > 0 && (
        <div className="px-4 py-3 flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-brand-success uppercase tracking-wider">Strengths</p>
          {(review.strengths as string[]).map((s, i) => (
            <p key={i} className="text-[12px] text-brand-text-muted">· {s}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: project, isLoading, isError } = useProject(id);

  const [code, setCode]           = useState<string>("");
  const [notes, setNotes]         = useState<string>("");
  const [leftTab, setLeftTab]     = useState<LeftTab>("instructions");
  const [bottomTab, setBottomTab] = useState<BottomTab>("results");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ProjectSubmitResult | null>(null);
  const [started, setStarted]     = useState(false);

  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed code + notes once project loads
  useEffect(() => {
    if (!project) return;
    const attempt = project.current_attempt;
    setCode(attempt?.code ?? project.starter_code ?? "");
    setNotes(attempt?.notes ?? "");
    setStarted(!!attempt);
    if (attempt?.last_run_results?.length) {
      setSubmitResult({
        passed: attempt.last_run_passed ?? false,
        score: attempt.last_run_score ?? 0,
        test_results: attempt.last_run_results,
        review: null,
        xp_earned: 0,
        newly_completed: false,
      });
    }
  }, [project?.id]);

  const ensureStarted = useCallback(async () => {
    if (started || !project) return;
    await startProject(project.id);
    setStarted(true);
  }, [started, project]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(async () => {
      await ensureStarted();
      await saveProjectCode(id, { code: newCode }).catch(() => {});
    }, AUTOSAVE_MS);
  }, [id, ensureStarted]);

  const handleNotesChange = useCallback((html: string) => {
    setNotes(html);
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(async () => {
      await ensureStarted();
      await saveProjectCode(id, { notes: html }).catch(() => {});
    }, AUTOSAVE_MS);
  }, [id, ensureStarted]);

  const handleSubmit = useCallback(async () => {
    if (!project || submitting) return;
    await ensureStarted();
    setSubmitting(true);
    try {
      const result = await submitProject(id, code);
      setSubmitResult(result);
      setBottomTab(project.grading_mode === "ai_review" ? "review" : "results");

      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    } finally {
      setSubmitting(false);
    }
  }, [project, submitting, id, code, ensureStarted, queryClient]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="size-6 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-sm text-brand-text-muted">Project not found.</p>
        <Link href="/projects" className="text-sm text-brand-primary hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const completed = project.current_attempt?.status === "completed";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-bg">
      <ProjectHeader
        ticketId={project.ticket_id}
        repo={project.repo}
        title={project.title}
        tier={project.tier}
        mode={project.mode}
        minutes={project.estimated_minutes}
        completed={completed}
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* Left — Instructions / Notes */}
          <ResizablePanel defaultSize={42} minSize={28}>
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-5 h-11 px-6 border-b border-brand-border shrink-0">
                {(["instructions", "notes"] as LeftTab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLeftTab(t)}
                    className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer outline-none transition-all duration-500 ${leftTab === t ? "text-brand-text" : "text-brand-text-muted hover:text-brand-text"}`}
                  >
                    {t === "instructions" ? <FileText className="size-3.5" /> : <StickyNote className="size-3.5" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    {leftTab === t && (
                      <motion.span layoutId="project-left-tab" transition={TAB_SPRING} className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {leftTab === "instructions" && (
                    <motion.div key="instructions" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING} className="h-full overflow-y-auto">
                      <InstructionsPanel html={project.instructions} />
                    </motion.div>
                  )}
                  {leftTab === "notes" && (
                    <motion.div key="notes" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING} className="h-full">
                      <NotesEditor content={notes} onChange={handleNotesChange} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {leftTab === "instructions" && (
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className={colHandle} />

          {/* Right — Editor + Results */}
          <ResizablePanel defaultSize={58} minSize={30}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              {/* Code editor */}
              <ResizablePanel defaultSize={55} minSize={25}>
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between h-11 px-4 border-b border-brand-border shrink-0">
                    <span className="text-xs text-brand-text">solution.py</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCode(project.starter_code ?? "")}
                        title="Reset to starter code"
                        className="p-1.5 rounded-lg text-brand-text-muted cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-primary text-white text-[11px] font-medium px-2.5 py-1.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
                      >
                        {submitting ? <Spinner size="xs" /> : <Play className="size-3" />}
                        {completed ? "Re-submit" : "Submit"}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <MonacoCodeEditor
                      value={code}
                      onChange={handleCodeChange}
                      language="python"
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-[3px] bg-brand-border hover:bg-brand-primary cursor-row-resize transition-all duration-500 shrink-0" />

              {/* Bottom tabs — results / review */}
              <ResizablePanel defaultSize={45} minSize={20}>
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex items-center gap-5 h-10 px-4 border-b border-brand-border shrink-0">
                    {BOTTOM_TABS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setBottomTab(id)}
                        className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer outline-none transition-all duration-500 ${bottomTab === id ? "text-brand-text" : "text-brand-text-muted hover:text-brand-text"}`}
                      >
                        <Icon className="size-3.5" /> {label}
                        {bottomTab === id && (
                          <motion.span layoutId="project-bottom-tab" transition={TAB_SPRING} className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {bottomTab === "results" && (
                        <motion.div key="results" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING}>
                          <TestResultsPanel
                            testCases={project.test_cases}
                            results={submitResult?.test_results ?? null}
                          />
                        </motion.div>
                      )}
                      {bottomTab === "hints" && (
                        <motion.div key="hints" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING}>
                          <div className="flex items-center justify-center h-32 text-[12px] text-brand-text-subtle">
                            Hints coming soon.
                          </div>
                        </motion.div>
                      )}
                      {bottomTab === "review" && (
                        <motion.div key="review" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING}>
                          <ReviewPanel review={submitResult?.review ?? null} />
                        </motion.div>
                      )}
                      {bottomTab === "solution" && (
                        <motion.div key="solution" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={TAB_SPRING}>
                          <div className="flex items-center justify-center h-32 text-[12px] text-brand-text-subtle">
                            Solution unlocks after completion.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
