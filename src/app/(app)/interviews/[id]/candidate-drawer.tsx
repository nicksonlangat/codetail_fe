"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Clock, WandSparkles, Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import go from "highlight.js/lib/languages/go";
import type { CandidateSession, CandidateSubmission } from "@/lib/api/interviews";
import { type CoachAssessment, runCandidateCoach } from "@/lib/api/interviews";
import "@/components/editors/tiptap.css";

const lowlight = createLowlight();
lowlight.register("python", python);
lowlight.register("sql", sql);
lowlight.register("go", go);

const STACK_LANG: Record<string, string> = {
  python: "python", django: "python", fastapi: "python",
  sql: "sql", go: "go",
};

function makeCodeDoc(code: string, language: string) {
  return {
    type: "doc",
    content: [{ type: "codeBlock", attrs: { language }, content: [{ type: "text", text: code }] }],
  };
}

function CodeHighlight({ code, language }: { code: string; language: string }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ codeBlock: false }), CodeBlockLowlight.configure({ lowlight })],
    content: makeCodeDoc(code, language),
    editable: false,
    immediatelyRender: false,
  });
  useEffect(() => { if (editor) editor.commands.setContent(makeCodeDoc(code, language)); }, [editor, code, language]);
  if (!editor) return null;
  return <EditorContent editor={editor} />;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DRAWER   = { type: "spring" as const, stiffness: 220, damping: 30 };
const ACCORDION = { duration: 0.4, ease: EASE_OUT };

const STATUS_STYLES: Record<string, { pill: string; label: string }> = {
  pending:     { pill: "bg-muted text-muted-foreground",        label: "Pending"     },
  in_progress: { pill: "bg-yellow-500/10 text-yellow-600",      label: "In Progress" },
  completed:   { pill: "bg-green-500/10 text-green-600",        label: "Completed"   },
  expired:     { pill: "bg-destructive/10 text-destructive",    label: "Expired"     },
};

function scoreColor(s: number) {
  if (s >= 80) return "text-green-500";
  if (s >= 60) return "text-primary";
  if (s >= 40) return "text-yellow-500";
  return "text-destructive";
}
function barColor(s: number) {
  if (s >= 80) return "bg-green-500";
  if (s >= 60) return "bg-primary";
  if (s >= 40) return "bg-yellow-500";
  return "bg-destructive";
}

interface ProblemItem { id: string; title: string; stack: string; concept: string; difficulty: string; type: string; }
interface Props { session: CandidateSession; problems: ProblemItem[]; interviewId: string; onClose: () => void; }

const TABS = ["Results", "AI Coach"] as const;
type Tab = typeof TABS[number];

export function CandidateDrawer({ session, problems, interviewId, onClose }: Props) {
  const [tab, setTab]       = useState<Tab>("Results");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [coach, setCoach]   = useState<CoachAssessment | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError]     = useState<string | null>(null);

  const st = STATUS_STYLES[session.status] ?? STATUS_STYLES.pending;
  const displayName = session.candidate_name || session.candidate_email;
  const totalTime = Math.round(session.submissions.reduce((a, s) => a + s.time_spent_seconds, 0) / 60);
  const invitedDate = new Date(session.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  async function runCoach() {
    setCoachLoading(true);
    setCoachError(null);
    try {
      const result = await runCandidateCoach(interviewId, session.id);
      setCoach(result);
    } catch {
      setCoachError("Failed to run assessment. Please try again.");
    } finally {
      setCoachLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={DRAWER}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[600px] bg-background border-l border-foreground/10 h-full flex flex-col shadow-2xl shadow-black/40"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 h-12 border-b border-border/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[14px] font-semibold truncate">{displayName}</span>
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${st.pill}`}>
              {st.label}
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500 ml-3 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="shrink-0 flex items-center border-b border-border/40 px-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-[12px] font-medium cursor-pointer transition-all duration-500 ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
              {tab === t && (
                <motion.div layoutId="cd-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {tab === "Results" && (
            <ResultsTab session={session} problems={problems} totalTime={totalTime} invitedDate={invitedDate} expanded={expanded} setExpanded={setExpanded} />
          )}
          {tab === "AI Coach" && (
            <CoachTab session={session} coach={coach} loading={coachLoading} error={coachError} onRun={runCoach} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResultsTab({ session, problems, totalTime, invitedDate, expanded, setExpanded }: {
  session: CandidateSession; problems: ProblemItem[]; totalTime: number; invitedDate: string;
  expanded: string | null; setExpanded: (id: string | null) => void;
}) {
  const isComplete = session.status === "completed";

  return (
    <>
      {/* Meta row */}
      <div className="px-5 py-4 border-b border-border/30">
        <p className="text-[11px] text-muted-foreground">
          {session.candidate_email}
          <span className="mx-2 opacity-30">·</span>
          Invited {invitedDate}
          <span className="mx-2 opacity-30">·</span>
          {totalTime > 0 ? `${totalTime}m total` : "Not started"}
        </p>
      </div>

      {/* Score + bars */}
      <div className="px-5 py-5 border-b border-border/30 flex gap-6 items-start">
        <div className="shrink-0 w-24">
          {isComplete ? (
            <>
              <p className={`text-[52px] font-black tabular-nums leading-none ${scoreColor(session.overall_score)}`}>
                {session.overall_score}
              </p>
              <p className="text-[11px] text-muted-foreground/50 mt-1">overall score</p>
            </>
          ) : (
            <>
              <p className="text-[52px] font-black tabular-nums leading-none text-muted-foreground/20">—</p>
              <p className="text-[11px] text-muted-foreground/50 mt-1">overall score</p>
            </>
          )}
        </div>
        <div className="flex-1 space-y-2.5 pt-1">
          {problems.map((p, i) => {
            const sub = session.submissions.find(s => s.problem_id.toString() === p.id);
            const score = sub?.score ?? 0;
            const attempted = !!sub;
            return (
              <div key={p.id} className="flex items-center gap-2.5">
                <span className="text-[10px] text-muted-foreground/40 font-mono w-3 shrink-0 tabular-nums">{i + 1}</span>
                <p className="text-[11px] text-muted-foreground truncate w-28 shrink-0">{p.title}</p>
                <div className="flex-1 h-1 bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: attempted ? `${score}%` : "0%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.04 }}
                    className={`h-full ${attempted ? barColor(score) : "bg-muted-foreground/20"}`}
                  />
                </div>
                <span className={`text-[10px] font-semibold tabular-nums w-7 text-right shrink-0 ${attempted ? scoreColor(score) : "text-muted-foreground/30"}`}>
                  {attempted ? `${score}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="px-5 pt-4 pb-6">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 mb-2">Questions</p>
        {problems.map((problem, i) => {
          const sub = session.submissions.find(s => s.problem_id.toString() === problem.id);
          const isOpen = expanded === problem.id;
          const score = sub?.score ?? null;
          return (
            <div key={problem.id} className="border-b border-border/20">
              <button
                onClick={() => setExpanded(isOpen ? null : problem.id)}
                className="w-full flex items-center gap-3 py-3 hover:bg-muted/20 cursor-pointer transition-all duration-500 text-left px-0"
              >
                <span className="text-[10px] text-muted-foreground/30 font-mono w-4 shrink-0 tabular-nums">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium leading-snug truncate">{problem.title}</p>
                  <p className="text-[11px] text-muted-foreground">{problem.stack} · {problem.concept}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {score !== null
                    ? <span className={`text-[12px] font-bold tabular-nums ${scoreColor(score)}`}>{score}%</span>
                    : <span className="text-[11px] text-muted-foreground/30">—</span>
                  }
                  {sub && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono tabular-nums">
                      <Clock className="w-3 h-3" />{Math.round(sub.time_spent_seconds / 60)}m
                    </span>
                  )}
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/30" />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    transition={ACCORDION} className="overflow-hidden"
                  >
                    <div className="pl-6 pb-4 pt-1">
                      {sub ? <SubmissionDetail submission={sub} problem={problem} /> : (
                        <p className="text-[12px] text-muted-foreground py-3">Not attempted.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SubmissionDetail({ submission, problem }: { submission: CandidateSubmission; problem: ProblemItem }) {
  const isMcq = problem.type === "mcq";
  const isCorrect = submission.score === 100;
  const lang = STACK_LANG[problem.stack.toLowerCase()] ?? "python";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-5">
        {[
          { label: "Score", value: `${submission.score}%` },
          !isMcq && submission.total_count > 0 ? { label: "Tests", value: `${submission.passed_count}/${submission.total_count}` } : null,
          { label: "Time", value: `${Math.round(submission.time_spent_seconds / 60)}m` },
        ].filter(Boolean).map(item => (
          <div key={item!.label}>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{item!.label}</p>
            <p className="text-[14px] font-bold tabular-nums leading-tight">{item!.value}</p>
          </div>
        ))}
      </div>
      {isMcq && (
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-mono border ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"}`}>
          <span className={`font-bold ${isCorrect ? "text-green-500" : "text-destructive"}`}>{isCorrect ? "✓" : "✗"}</span>
          <span className="text-foreground/70">
            Selected: <strong className="text-foreground">{submission.selected_option?.toUpperCase() ?? "—"}</strong>
          </span>
          <span className={`ml-auto text-[10px] font-semibold uppercase tracking-wider ${isCorrect ? "text-green-600" : "text-destructive"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
      )}
      {submission.ai_feedback && (
        <div className="border-l-2 border-primary/30 pl-3 py-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">AI Feedback</p>
          <p className="text-[12px] leading-relaxed text-foreground/70">{submission.ai_feedback}</p>
        </div>
      )}
      {submission.test_results.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Test cases</p>
          {submission.test_results.map((tr, i) => (
            <div key={i} className={`flex items-start gap-2 px-2.5 py-1.5 text-[11px] font-mono border-l-2 ${tr.passed ? "border-green-500 bg-green-500/5" : "border-destructive bg-destructive/5"}`}>
              <span className={`shrink-0 font-bold ${tr.passed ? "text-green-500" : "text-destructive"}`}>{tr.passed ? "✓" : "✗"}</span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground truncate">in: {tr.input}</p>
                {!tr.passed && <p className="text-destructive truncate">got: {tr.actual}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isMcq && submission.code && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1.5">Submitted code</p>
          <div className="max-h-64 overflow-y-auto rounded-md text-[11px]">
            <CodeHighlight code={submission.code} language={lang} />
          </div>
        </div>
      )}
    </div>
  );
}

const RECOMMEND_STYLES: Record<string, string> = {
  hire:     "bg-green-500/10 text-green-600 border border-green-500/20",
  consider: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  pass:     "bg-destructive/10 text-destructive border border-destructive/20",
};

function CoachTab({ session, coach, loading, error, onRun }: {
  session: CandidateSession; coach: CoachAssessment | null;
  loading: boolean; error: string | null; onRun: () => void;
}) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
      <p className="text-[12px] text-muted-foreground">Evaluating submissions…</p>
    </div>
  );

  if (!coach) return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-3">
      <WandSparkles className="w-8 h-8 text-muted-foreground/20" />
      <p className="text-[14px] font-semibold">AI Coach Assessment</p>
      <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs">
        Analyse this candidate's submissions and get a hiring recommendation.
      </p>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
      {session.status !== "completed" ? (
        <p className="text-[11px] text-muted-foreground/50 mt-1">Assessment available after candidate completes.</p>
      ) : (
        <button
          onClick={onRun}
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground text-[13px] font-semibold rounded-md cursor-pointer hover:bg-primary/90 transition-all duration-500"
        >
          Run Assessment →
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-8">
      {/* Recommendation */}
      <div className="px-5 py-5 border-b border-border/30 flex items-center gap-3">
        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${RECOMMEND_STYLES[coach.recommendation] ?? RECOMMEND_STYLES.pass}`}>
          {coach.recommendation}
        </span>
        <span className="text-[12px] text-muted-foreground">
          Technical depth <span className="font-semibold text-foreground">{coach.technical_depth}</span>/10
        </span>
      </div>

      {/* Summary */}
      <div className="px-5 py-4 border-b border-border/30">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/50 mb-2">Summary</p>
        <p className="text-[13px] leading-relaxed text-foreground/80">{coach.summary}</p>
      </div>

      {/* Strengths */}
      {coach.strengths.length > 0 && (
        <div className="px-5 py-4 border-b border-border/30">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/50 mb-2">Strengths</p>
          <ul className="space-y-1.5">
            {coach.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/70">
                <span className="text-primary mt-0.5 shrink-0">·</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {coach.weaknesses.length > 0 && (
        <div className="px-5 py-4 border-b border-border/30">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/50 mb-2">Areas to probe</p>
          <ul className="space-y-1.5">
            {coach.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/70">
                <span className="text-muted-foreground/40 mt-0.5 shrink-0">·</span>{w}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-5 pt-4">
        <button
          onClick={onRun}
          className="text-[11px] font-medium px-3 py-1.5 ring-1 ring-border/60 rounded-md cursor-pointer hover:bg-muted transition-all duration-500"
        >
          Re-run Assessment
        </button>
      </div>
    </div>
  );
}
