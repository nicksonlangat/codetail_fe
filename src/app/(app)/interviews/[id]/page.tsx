"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, Clock, Copy, Check, Send, Loader2,
  ChevronRight, ClipboardList, ExternalLink, X
} from "lucide-react";
import Link from "next/link";
import {
  getInterview, getInterviewResults, inviteCandidate,
  type CandidateSession, type CandidateSubmission,
} from "@/lib/api/interviews";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-green-500/10 text-green-500",
  expired: "bg-destructive/10 text-destructive",
};

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: interview, isLoading: ivLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
  });

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["interview-results", id],
    queryFn: () => getInterviewResults(id),
    refetchInterval: 30_000,
  });

  const [showInvite, setShowInvite] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CandidateSession | null>(null);

  if (ivLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-3">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-40 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!interview) return null;

  const sessions = results?.sessions ?? [];
  const invitedCount = sessions.length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const avgScore =
    completedCount > 0
      ? Math.round(sessions.filter((s) => s.status === "completed").reduce((acc, s) => acc + s.overall_score, 0) / completedCount)
      : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <Link href="/interviews" className="mt-1 text-muted-foreground hover:text-foreground transition-all duration-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{interview.title}</h1>
              {interview.role && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {interview.role}
                </span>
              )}
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${interview.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground/50"}`}>
                {interview.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            {interview.description && (
              <p className="text-[12px] text-muted-foreground mt-0.5 max-w-xl">{interview.description}</p>
            )}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          Invite Candidate
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Problems", value: interview.problems.length, icon: ClipboardList },
          { label: "Time limit", value: `${interview.time_limit_minutes}m`, icon: Clock },
          { label: "Invited", value: invitedCount, icon: Users },
          { label: "Avg score", value: avgScore != null ? `${avgScore}%` : "—", icon: Check },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border/60 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-[20px] font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Problems list */}
        <div className="col-span-2 bg-card border border-border/60 rounded-2xl p-5 space-y-3 h-fit">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Problems</p>
          <div className="space-y-1.5">
            {interview.problems.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground/50 font-mono w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">{p.stack} · {p.concept}</p>
                </div>
                <span className={`text-[10px] font-semibold shrink-0 ${
                  p.difficulty === "easy" ? "text-difficulty-easy"
                  : p.difficulty === "medium" ? "text-difficulty-medium"
                  : "text-difficulty-hard"
                }`}>
                  {p.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate sessions */}
        <div className="col-span-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Candidates
          </p>
          {resultsLoading && (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
            </div>
          )}
          {!resultsLoading && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border/60 rounded-2xl">
              <Users className="w-6 h-6 text-muted-foreground/30 mb-3" />
              <p className="text-[13px] font-medium">No candidates yet</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Click "Invite Candidate" to send an assessment link.
              </p>
            </div>
          )}
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              problemCount={interview.problems.length}
              onClick={() => setSelectedSession(session)}
            />
          ))}
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <InviteModal
            interviewId={id}
            onClose={() => setShowInvite(false)}
            onSuccess={() => {
              qc.invalidateQueries({ queryKey: ["interview-results", id] });
              setShowInvite(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Candidate result drawer */}
      <AnimatePresence>
        {selectedSession && (
          <CandidateDrawer
            session={selectedSession}
            problems={interview.problems}
            onClose={() => setSelectedSession(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionRow({
  session,
  problemCount,
  onClick,
}: {
  session: CandidateSession;
  problemCount: number;
  onClick: () => void;
}) {
  const submitted = session.submissions.length;
  const name = session.candidate_name || session.candidate_email;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border/60 bg-card hover:border-border text-left cursor-pointer transition-all duration-500 group"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-semibold text-primary">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{session.candidate_email}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-muted-foreground">{submitted}/{problemCount} solved</span>
        {session.status === "completed" && (
          <span className="text-[12px] font-semibold tabular-nums">{session.overall_score}%</span>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[session.status]}`}>
          {session.status.replace("_", " ")}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-all duration-500" />
      </div>
    </motion.button>
  );
}

function InviteModal({
  interviewId,
  onClose,
  onSuccess,
}: {
  interviewId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteMutation = useMutation({
    mutationFn: () => inviteCandidate(interviewId, { candidate_email: email, candidate_name: name }),
    onSuccess: (res) => setLink(res.assess_url),
  });

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold">Invite Candidate</p>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!link ? (
            <>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">Candidate email *</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@company.com"
                    type="email"
                    className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">Candidate name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
                  />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => inviteMutation.mutate()}
                disabled={!email.trim() || inviteMutation.isPending}
                className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-500"
              >
                {inviteMutation.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : "Generate Link"}
              </motion.button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[12px] text-muted-foreground">
                  Share this link with the candidate. It's unique and single-use.
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted border border-border/60">
                  <span className="flex-1 text-[11px] font-mono text-foreground/80 truncate">{link}</span>
                  <button
                    onClick={copyLink}
                    className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                  >
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-primary" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
                </button>
                <button
                  onClick={() => { onSuccess(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CandidateDrawer({
  session,
  problems,
  onClose,
}: {
  session: CandidateSession;
  problems: { id: string; title: string; type: string }[];
  onClose: () => void;
}) {
  const [activeProblemId, setActiveProblemId] = useState<string | null>(
    session.submissions[0]?.problem_id?.toString() ?? null
  );

  const activeSubmission = session.submissions.find(
    (s) => s.problem_id.toString() === activeProblemId
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border-l border-border h-full overflow-y-auto"
      >
        <div className="sticky top-0 bg-card/90 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[14px] font-semibold">
              {session.candidate_name || session.candidate_email}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[session.status]}`}>
                {session.status.replace("_", " ")}
              </span>
              {session.status === "completed" && (
                <span className="text-[12px] font-semibold tabular-nums text-foreground">
                  {session.overall_score}% overall
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Problem tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {problems.map((p) => {
              const sub = session.submissions.find((s) => s.problem_id.toString() === p.id);
              const isActive = activeProblemId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProblemId(p.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "bg-primary/8 border-primary/30 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {sub ? (
                    <span className={`w-2 h-2 rounded-full ${sub.passed_count === sub.total_count && sub.total_count > 0 ? "bg-green-500" : sub.score > 0 ? "bg-yellow-500" : "bg-destructive"}`} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                  {p.title.split(" ").slice(0, 4).join(" ")}
                  {sub && <span className="text-[10px] font-mono">{sub.score}%</span>}
                </button>
              );
            })}
          </div>

          {/* Submission detail */}
          {activeSubmission ? (
            <SubmissionDetail submission={activeSubmission} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-[12px] text-muted-foreground">Candidate has not submitted this problem.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SubmissionDetail({ submission }: { submission: CandidateSubmission }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-[28px] font-semibold tabular-nums leading-none">{submission.score}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Score</p>
        </div>
        {submission.total_count > 0 && (
          <div className="text-center">
            <p className="text-[28px] font-semibold tabular-nums leading-none">
              {submission.passed_count}/{submission.total_count}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Tests passed</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-[28px] font-semibold tabular-nums leading-none">
            {Math.round(submission.time_spent_seconds / 60)}m
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Time spent</p>
        </div>
      </div>

      {submission.ai_feedback && (
        <div className="p-3.5 rounded-xl bg-muted/50 border border-border/40">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">AI Feedback</p>
          <p className="text-[12px] text-foreground leading-relaxed">{submission.ai_feedback}</p>
        </div>
      )}

      {submission.test_results.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Test cases</p>
          {submission.test_results.map((tr, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-[11px] font-mono ${
                tr.passed ? "bg-green-500/8 border border-green-500/20" : "bg-destructive/8 border border-destructive/20"
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${tr.passed ? "text-green-500" : "text-destructive"}`}>
                {tr.passed ? "✓" : "✗"}
              </span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-muted-foreground truncate">in: {tr.input}</p>
                <p className="truncate">expected: {tr.expected}</p>
                {!tr.passed && <p className="text-destructive truncate">got: {tr.actual}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {submission.code && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Submitted code</p>
          <pre className="text-[11px] font-mono bg-muted rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
            {submission.code}
          </pre>
        </div>
      )}
    </div>
  );
}
