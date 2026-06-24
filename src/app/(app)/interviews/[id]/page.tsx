"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, Clock, Copy, Check, Send, Loader2,
  ClipboardList, X, WandSparkles, LayoutDashboard, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { CTLogo } from "@/components/brand/logo";
import {
  getInterview, getInterviewResults, inviteCandidate,
  type CandidateSession,
} from "@/lib/api/interviews";
import { CandidatesTable } from "./candidates-table";
import { CandidateDrawer } from "./candidate-drawer";
import { QuestionsTab } from "./questions-tab";

const SP  = { type: "spring" as const, stiffness: 300, damping: 30 };
const SP2 = { type: "spring" as const, stiffness: 400, damping: 25 };


const TABS = [
  { id: "overview",   label: "Overview",      icon: LayoutDashboard },
  { id: "questions",  label: "Questions",     icon: ClipboardList },
  { id: "candidates", label: "Candidates",    icon: Users },
  { id: "assistant",  label: "AI Assistant",  icon: WandSparkles },
];

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState("overview");
  const [showInvite, setShowInvite] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CandidateSession | null>(null);

  const { data: interview, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
  });
  const { data: results } = useQuery({
    queryKey: ["interview-results", id],
    queryFn: () => getInterviewResults(id),
    refetchInterval: 30_000,
  });

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
      <div className="h-7 w-48 bg-muted animate-pulse rounded-lg" />
      <div className="h-48 bg-muted animate-pulse rounded-2xl" />
    </div>
  );
  if (!interview) return null;

  const sessions = results?.sessions ?? [];
  const completed = sessions.filter(s => s.status === "completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, s) => a + s.overall_score, 0) / completed.length)
    : null;

  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 h-12 border-b border-border/50 bg-card/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <CTLogo size={18} />
          <Link href="/interviews" className="text-[12px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer shrink-0">
            Interviews
          </Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
          <span className="text-[12px] font-medium text-foreground truncate">{interview.title}</span>
          <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${interview.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground/40"}`}>
            {interview.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP2}
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500 shrink-0"
        >
          <Send className="w-3.5 h-3.5" /> Invite Candidate
        </motion.button>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 py-8 space-y-6 flex-1">

      {/* Title block */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">{interview.title}</h1>
        {interview.description && (
          <p className="text-[13px] text-muted-foreground mt-1 max-w-xl">{interview.description}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/50">
        {TABS.map(({ id: tid, label, icon: Icon }) => {
          const active = tab === tid;
          return (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium cursor-pointer transition-all duration-300 ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={SP}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={SP}
        >
          {tab === "overview"   && <OverviewTab interview={interview} sessions={sessions} avgScore={avgScore} />}
          {tab === "questions"  && <QuestionsTab problems={interview.problems} />}
          {tab === "candidates" && <CandidatesTab sessions={sessions} problems={interview.problems} onSelect={setSelectedSession} onInvite={() => setShowInvite(true)} />}
          {tab === "assistant"  && <AssistantTab />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && (
          <InviteModal
            interviewId={id}
            onClose={() => setShowInvite(false)}
            onInvited={() => qc.invalidateQueries({ queryKey: ["interview-results", id] })}
            onSuccess={() => setShowInvite(false)}
          />
        )}
        {selectedSession && (
          <CandidateDrawer
            session={selectedSession}
            problems={interview.problems}
            interviewId={id}
            onClose={() => setSelectedSession(null)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

function OverviewTab({ interview, sessions, avgScore }: {
  interview: { problems: { id: string }[]; time_limit_minutes: number };
  sessions: CandidateSession[];
  avgScore: number | null;
}) {
  const stats = [
    { label: "Problems",   value: interview.problems.length,                icon: ClipboardList },
    { label: "Time limit", value: `${interview.time_limit_minutes}m`,       icon: Clock },
    { label: "Invited",    value: sessions.length,                          icon: Users },
    { label: "Avg score",  value: avgScore != null ? `${avgScore}%` : "—",  icon: Check },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-[24px] font-bold tabular-nums leading-none">{value}</p>
        </div>
      ))}
    </div>
  );
}


// ── Candidates ────────────────────────────────────────────────────────────────

function CandidatesTab({ sessions, problems, onSelect, onInvite }: {
  sessions: CandidateSession[];
  problems: { id: string }[];
  onSelect: (s: CandidateSession) => void;
  onInvite: () => void;
}) {
  return (
    <CandidatesTable
      sessions={sessions}
      totalProblems={problems.length}
      onSelect={onSelect}
      onInvite={onInvite}
    />
  );
}

// ── AI Assistant stub ─────────────────────────────────────────────────────────

function AssistantTab() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
        <WandSparkles className="w-5 h-5 text-primary" />
      </div>
      <p className="text-[14px] font-semibold">AI Interview Assistant</p>
      <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed">
        Ask questions about candidate performance, get suggested follow-up questions, and summarise results.
      </p>
      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
        Coming soon
      </span>
    </div>
  );
}

// ── Invite modal ──────────────────────────────────────────────────────────────

const EXPIRY_OPTIONS = [
  { label: "24 hours", value: 24 }, { label: "48 hours", value: 48 },
  { label: "3 days",   value: 72 }, { label: "7 days",   value: 168 }, { label: "14 days", value: 336 },
];

function InviteModal({ interviewId, onClose, onInvited, onSuccess }: { interviewId: string; onClose: () => void; onInvited: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [expires, setExpires] = useState(168);
  const [result, setResult] = useState<{ url: string; sentTo: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const invite = useMutation({
    mutationFn: () => inviteCandidate(interviewId, { candidate_email: email, candidate_name: name, expires_in_hours: expires }),
    onSuccess: (res) => { setResult({ url: res.assess_url, sentTo: email }); onInvited(); },
  });

  const copy = () => { if (!result) return; navigator.clipboard.writeText(result.url); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.96, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }} transition={SP} onClick={e => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold">Invite Candidate</p>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"><X className="w-4 h-4" /></button>
          </div>
          {!result ? (
            <>
              <div className="space-y-3">
                {[{ label: "Email *", val: email, set: setEmail, ph: "candidate@company.com", type: "email" },
                  { label: "Name",   val: name,  set: setName,  ph: "Jane Smith",             type: "text"  }].map(f => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground">{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type}
                      className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500" />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">Expires in</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {EXPIRY_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => setExpires(o.value)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border cursor-pointer transition-all duration-500 ${
                          expires === o.value ? "bg-primary/8 border-primary/30 text-primary" : "border-border/60 text-muted-foreground hover:border-border"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} transition={SP2} onClick={() => invite.mutate()}
                disabled={!email.trim() || invite.isPending}
                className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
                {invite.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Send Invite</>}
              </motion.button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-500/8 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[12px]">Invite sent to <span className="font-semibold">{result.sentTo}</span>.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted border border-border/60">
                <span className="flex-1 text-[11px] font-mono truncate">{result.url}</span>
                <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={copy} className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500">
                  {copied ? <><Check className="w-3.5 h-3.5 text-primary" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
                </button>
                <button onClick={onSuccess} className="flex-1 flex items-center justify-center text-[12px] font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500">Done</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

