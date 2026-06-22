"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Clock, WandSparkles, Mail, Calendar } from "lucide-react";
import type { CandidateSession, CandidateSubmission } from "@/lib/api/interviews";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const ACCORDION = { duration: 0.45, ease: EASE_OUT };
const CHEVRON   = { duration: 0.35, ease: EASE_OUT };
const CONTENT   = { duration: 0.3,  ease: EASE_OUT, delay: 0.06 };
const DRAWER    = { type: "spring" as const, stiffness: 220, damping: 30 };

const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  pending:     { pill: "bg-muted text-muted-foreground",          dot: "bg-muted-foreground/40", label: "Pending"     },
  in_progress: { pill: "bg-yellow-500/10 text-yellow-500",        dot: "bg-yellow-500",          label: "In Progress" },
  completed:   { pill: "bg-green-500/10 text-green-500",          dot: "bg-green-500",           label: "Completed"   },
  expired:     { pill: "bg-destructive/10 text-destructive",      dot: "bg-destructive",         label: "Expired"     },
};

function barColor(score: number) {
  if (score === 100) return "bg-green-500";
  if (score >= 60)   return "bg-primary";
  if (score >= 30)   return "bg-yellow-500";
  return "bg-destructive";
}

function scoreTextColor(score: number) {
  if (score === 100) return "text-green-500";
  if (score >= 60)   return "text-primary";
  if (score >= 30)   return "text-yellow-500";
  return "text-destructive";
}

interface ProblemItem {
  id: string;
  title: string;
  stack: string;
  concept: string;
  difficulty: string;
  type: string;
}

interface Props {
  session: CandidateSession;
  problems: ProblemItem[];
  onClose: () => void;
}

export function CandidateDrawer({ session, problems, onClose }: Props) {
  const firstAttempted = problems.find(p =>
    session.submissions.some(s => s.problem_id.toString() === p.id)
  );
  const [expanded, setExpanded] = useState<string | null>(firstAttempted?.id ?? null);

  const st = STATUS_STYLES[session.status] ?? STATUS_STYLES.pending;
  const initials = (session.candidate_name || session.candidate_email)
    .split(/[\s@]/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const totalTime = Math.round(
    session.submissions.reduce((a, s) => a + s.time_spent_seconds, 0) / 60
  );
  const invitedDate = new Date(session.created_at).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

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
        className="w-full max-w-[640px] bg-card border-l border-border h-full flex flex-col shadow-2xl shadow-black/30"
      >
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold">Candidate Results</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Candidate info ── */}
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-bold text-primary">{initials}</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold leading-tight">
                    {session.candidate_name || session.candidate_email}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Invited {invitedDate}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 mt-0.5 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
              </span>
            </div>

            {/* Contact chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {session.candidate_name && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {session.candidate_email}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                <Clock className="w-3 h-3" />
                {totalTime > 0 ? `${totalTime}m total` : "Not started"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {invitedDate}
              </span>
            </div>
          </div>

          {/* ── Score overview ── */}
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex gap-5">
              {/* Big score */}
              <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-muted">
                {session.status === "completed" ? (
                  <>
                    <p className="text-[26px] font-black tabular-nums leading-none">{session.overall_score}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">/ 100</p>
                  </>
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center px-2 leading-snug">Not complete</p>
                )}
              </div>

              {/* Per-problem bars */}
              <div className="flex-1 space-y-2.5 py-1">
                {problems.map((p, i) => {
                  const sub = session.submissions.find(s => s.problem_id.toString() === p.id);
                  const score = sub?.score ?? 0;
                  const attempted = !!sub;
                  return (
                    <div key={p.id} className="flex items-center gap-2.5">
                      <span className="text-[10px] text-muted-foreground/50 font-mono w-3 shrink-0 tabular-nums">{i + 1}</span>
                      <p className="text-[11px] text-muted-foreground truncate w-28 shrink-0">{p.title}</p>
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: attempted ? `${score}%` : "0%" }}
                          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 + i * 0.04 }}
                          className={`h-full rounded-full ${attempted ? barColor(score) : "bg-muted-foreground/20"}`}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold tabular-nums w-7 text-right shrink-0 ${attempted ? scoreTextColor(score) : "text-muted-foreground/30"}`}>
                        {attempted ? `${score}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Questions accordion ── */}
          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">Questions</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.pill}`}>{st.label}</span>
            </div>

            {problems.map((problem, i) => {
              const sub = session.submissions.find(s => s.problem_id.toString() === problem.id);
              const isOpen = expanded === problem.id;
              const score = sub?.score ?? null;

              return (
                <div key={problem.id} className="rounded-xl border border-border/60 bg-card overflow-hidden">
                  {/* Row trigger */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : problem.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 cursor-pointer transition-all duration-300 text-left"
                  >
                    <span className="text-[11px] text-muted-foreground/40 font-mono w-4 shrink-0 tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold leading-snug truncate">{problem.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{problem.stack} · {problem.concept}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {score !== null ? (
                        <span className={`text-[13px] font-bold tabular-nums ${scoreTextColor(score)}`}>{score}%</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/40">Not attempted</span>
                      )}
                      {sub && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono tabular-nums">
                          <Clock className="w-3 h-3" />{Math.round(sub.time_spent_seconds / 60)}m
                        </span>
                      )}
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={CHEVRON}>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={ACCORDION}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={CONTENT}
                          className="border-t border-border/40 px-4 py-4"
                        >
                        {sub ? <SubmissionDetail submission={sub} /> : (
                            <p className="text-[12px] text-muted-foreground text-center py-4">
                              Candidate did not attempt this question.
                            </p>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SubmissionDetail({ submission }: { submission: CandidateSubmission }) {
  return (
    <div className="space-y-3.5">
      {/* Mini stats */}
      <div className="flex items-center gap-5">
        {[
          { label: "Score",  value: `${submission.score}%` },
          submission.total_count > 0 ? { label: "Tests", value: `${submission.passed_count}/${submission.total_count}` } : null,
          { label: "Time",   value: `${Math.round(submission.time_spent_seconds / 60)}m` },
        ].filter(Boolean).map(item => (
          <div key={item!.label}>
            <p className="text-[10px] text-muted-foreground">{item!.label}</p>
            <p className="text-[14px] font-bold tabular-nums leading-tight">{item!.value}</p>
          </div>
        ))}
      </div>

      {/* AI feedback */}
      {submission.ai_feedback && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <WandSparkles className="w-3 h-3" />
            <p className="text-[10px] font-semibold uppercase tracking-wider">AI Feedback</p>
          </div>
          <p className="text-[12px] leading-relaxed">{submission.ai_feedback}</p>
        </div>
      )}

      {/* Test cases */}
      {submission.test_results.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Test cases</p>
          <div className="space-y-1">
            {submission.test_results.map((tr, i) => (
              <div key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-[11px] font-mono ${tr.passed ? "bg-green-500/8 border border-green-500/20" : "bg-destructive/8 border border-destructive/20"}`}>
                <span className={`shrink-0 font-bold ${tr.passed ? "text-green-500" : "text-destructive"}`}>{tr.passed ? "✓" : "✗"}</span>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-muted-foreground truncate">in: {tr.input}</p>
                  <p className="truncate">expected: {tr.expected}</p>
                  {!tr.passed && <p className="text-destructive truncate">got: {tr.actual}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code */}
      {submission.code && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Submitted code</p>
          <pre className="text-[11px] font-mono bg-muted rounded-xl p-3.5 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words max-h-60">
            {submission.code}
          </pre>
        </div>
      )}
    </div>
  );
}
