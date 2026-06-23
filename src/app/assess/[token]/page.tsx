"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Clock, ChevronLeft, ChevronRight, Send, Play, Check, X, AlertTriangle } from "lucide-react";
import {
  getAssessSession,
  startAssessSession,
  resendAssessInvite,
  submitAssessProblem,
  finishAssessSession,
  type AssessSession,
  type AssessProblem,
  type AssessMcqOption,
  type CandidateSubmission,
  type CandidateTestResult,
} from "@/lib/api/interviews";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { CTLogo } from "@/components/brand/logo";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function AssessPage() {
  const { token } = useParams<{ token: string }>();

  const { data: session, isLoading, error, refetch } = useQuery({
    queryKey: ["assess", token],
    queryFn: () => getAssessSession(token),
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-[15px] font-semibold">Assessment not found</p>
          <p className="text-[12px] text-muted-foreground">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (session.status === "completed") {
    return <CompletedScreen session={session} />;
  }

  if (session.status === "pending") {
    return <WelcomeScreen token={token} session={session} onStarted={() => refetch()} />;
  }

  return <AssessmentScreen token={token} session={session} onFinished={() => refetch()} />;
}

// ── Welcome / Start screen ──

function WelcomeScreen({
  token,
  session,
  onStarted,
}: {
  token: string;
  session: AssessSession;
  onStarted: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSent, setResendSent] = useState(false);

  const startMutation = useMutation({
    mutationFn: () => startAssessSession(token, otp.trim()),
    onSuccess: onStarted,
    onError: () => setOtpError("Invalid code — check your invite email and try again."),
  });

  const resendMutation = useMutation({
    mutationFn: () => resendAssessInvite(token),
    onSuccess: () => {
      setResendSent(true);
      setResendCooldown(30);
      const tick = setInterval(() => {
        setResendCooldown(c => {
          if (c <= 1) { clearInterval(tick); return 0; }
          return c - 1;
        });
      }, 1000);
    },
  });

  function handleSubmit() {
    setOtpError("");
    startMutation.mutate();
  }

  const NOTES = [
    "Timer starts when you click Start and cannot be paused.",
    "Submit each problem individually — you can re-submit to improve your score.",
    "Click Finish when done or when time runs out.",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="w-full max-w-[420px]"
      >
        {/* Brand */}
        <div className="mb-10">
          <CTLogo size={32} />
          <p className="text-[15px] font-black tracking-tight select-none mt-3">
            code<span className="text-primary">tail</span>
          </p>
        </div>

        {/* Title block */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary mb-3">
            Technical Assessment
          </p>
          <h1 className="text-[30px] font-semibold tracking-tight leading-[1.15] text-foreground">
            {session.interview_title}
          </h1>
          {session.role && (
            <p className="text-[14px] text-muted-foreground mt-1">{session.role}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-8 py-6 border-y border-border/50 mb-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1">Problems</p>
            <p className="text-[22px] font-semibold tabular-nums leading-none">{session.problems.length}</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1">Time limit</p>
            <p className="text-[22px] font-semibold tabular-nums leading-none">{session.time_limit_minutes} min</p>
          </div>
        </div>

        {/* Rules */}
        <div className="mb-8 space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-3">
            Before you begin
          </p>
          {NOTES.map((note, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[11px] font-mono text-muted-foreground/30 shrink-0 mt-px tabular-nums">{i + 1}.</span>
              <p className="text-[12px] text-muted-foreground/80 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        {/* OTP */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="flex items-baseline gap-1.5 text-[11px] font-medium text-muted-foreground">
              Access code
              {session.masked_email && (
                <span className="text-muted-foreground/40 font-normal">— sent to {session.masked_email}</span>
              )}
            </label>
            <input
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter" && otp.length === 6) handleSubmit(); }}
              placeholder="_ _ _ _ _ _"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              className="w-full text-[22px] font-mono tracking-[0.35em] text-center bg-card border border-border/70 rounded-xl px-4 py-4 placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300"
            />
            {otpError && (
              <p className="text-[11px] text-destructive">{otpError}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleSubmit}
            disabled={otp.length !== 6 || startMutation.isPending}
            className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 cursor-pointer transition-all duration-300"
          >
            {startMutation.isPending ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying…</>
            ) : (
              "Start Assessment →"
            )}
          </motion.button>

          <p className="text-center text-[11px] text-muted-foreground/40">
            Didn't receive it?{" "}
            <button
              onClick={() => resendMutation.mutate()}
              disabled={resendCooldown > 0 || resendMutation.isPending}
              className="text-primary hover:text-primary/70 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-default"
            >
              {resendMutation.isPending
                ? "Sending…"
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : resendSent
                ? "Sent!"
                : "Resend email"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main assessment IDE ──

function AssessmentScreen({
  token,
  session: initialSession,
  onFinished,
}: {
  token: string;
  session: AssessSession;
  onFinished: () => void;
}) {
  const [session, setSession] = useState(initialSession);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(session.problems.map((p) => [p.id, p.starter_code]))
  );
  const [results, setResults] = useState<Record<string, CandidateTestResult[]>>(() =>
    Object.fromEntries(
      session.submissions.map((s) => [s.problem_id.toString(), s.test_results])
    )
  );
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(session.submissions.map((s) => [s.problem_id.toString(), s.score]))
  );
  const [aiFeedbacks, setAiFeedbacks] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(session.submissions.map((s) => [s.problem_id.toString(), s.ai_feedback]))
  );
  const [submitErrors, setSubmitErrors] = useState<Record<string, string | null>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [correctOptions, setCorrectOptions] = useState<Record<string, string | null>>({});
  const [running, setRunning] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(session.seconds_remaining ?? session.time_limit_minutes * 60);
  const startTimeRef = useRef(Date.now());

  const activeProblem = session.problems[activeProblemIdx];

  // Countdown timer
  useEffect(() => {
    if (session.status !== "in_progress") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status]);

  const submitMutation = useMutation({
    mutationFn: (problemId: string) => {
      const problem = session.problems.find((p) => p.id === problemId);
      const isMcq = problem?.type === "mcq";
      return submitAssessProblem(token, {
        problem_id: problemId,
        ...(isMcq
          ? { selected_option: selectedOptions[problemId] }
          : { code: codes[problemId] ?? "" }),
        time_spent_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    },
    onMutate: () => setRunning(true),
    onSuccess: (res) => {
      setResults((prev) => ({ ...prev, [res.problem_id]: res.test_results }));
      setScores((prev) => ({ ...prev, [res.problem_id]: res.score }));
      setAiFeedbacks((prev) => ({ ...prev, [res.problem_id]: res.ai_feedback }));
      setCorrectOptions((prev) => ({ ...prev, [res.problem_id]: res.correct_option }));
      setSubmitErrors((prev) => ({ ...prev, [res.problem_id]: res.error }));
      setRunning(false);
    },
    onError: () => setRunning(false),
  });

  const finishMutation = useMutation({
    mutationFn: () => finishAssessSession(token),
    onSuccess: onFinished,
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timerColor = secondsLeft < 300 ? "text-destructive" : secondsLeft < 600 ? "text-yellow-500" : "text-foreground";

  const submittedProblems = new Set(Object.keys(scores).filter((k) => scores[k] !== undefined));

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between h-12 px-5 border-b border-border/60 bg-card/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CTLogo size={20} />
            <span className="text-[13px] font-black tracking-tight text-foreground select-none">
              code<span className="text-primary">tail</span>
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/40">·</span>
          <span className="text-[11px] text-muted-foreground truncate max-w-60">
            {session.interview_title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Problem tabs */}
          <div className="flex items-center gap-1">
            {session.problems.map((p, i) => {
              const submitted = submittedProblems.has(p.id);
              const isActive = i === activeProblemIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProblemIdx(i)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {submitted && (
                    <span className={`w-1.5 h-1.5 rounded-full ${(scores[p.id] ?? 0) >= 80 ? "bg-green-500" : "bg-yellow-500"}`} />
                  )}
                  P{i + 1}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-border/40" />

          {/* Timer */}
          <div className={`flex items-center gap-1.5 text-[12px] font-mono font-semibold tabular-nums ${timerColor}`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsLeft)}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFinish(true)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
          >
            Finish
          </motion.button>
        </div>
      </div>

      {/* Main split */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        {/* Left: problem description */}
        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="h-full overflow-y-auto px-6 py-5">
            <ProblemDescription problem={activeProblem} />
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-primary/30 transition-colors cursor-col-resize" />

        {/* Right: MCQ choices OR editor + results */}
        <ResizablePanel defaultSize={55} minSize={30}>
          {activeProblem.type === "mcq" ? (
            <McqPanel
              problem={activeProblem}
              selectedOption={selectedOptions[activeProblem.id] ?? null}
              correctOption={correctOptions[activeProblem.id] ?? null}
              score={scores[activeProblem.id]}
              running={running}
              onSelect={(optId) =>
                setSelectedOptions((prev) => ({ ...prev, [activeProblem.id]: optId }))
              }
              onSubmit={() => submitMutation.mutate(activeProblem.id)}
            />
          ) : (
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel defaultSize={65} minSize={30}>
                <div className="flex flex-col h-full min-h-0">
                  <div className="flex items-center justify-between px-3 h-10 border-b border-border bg-muted/50 dark:bg-card/50 shrink-0">
                    <span className="text-[11px] font-medium text-muted-foreground px-1">
                      {activeProblem.stack === "django" ? "Django" : "Python"} · main.py
                    </span>
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => submitMutation.mutate(activeProblem.id)}
                        disabled={running}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500"
                      >
                        {running ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Running…</>
                        ) : (
                          <><Send className="w-3 h-3" /> Submit</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <MonacoCodeEditor
                      value={codes[activeProblem.id] ?? activeProblem.starter_code}
                      onChange={(v) => setCodes((prev) => ({ ...prev, [activeProblem.id]: v }))}
                      language="python"
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-1 bg-border hover:bg-primary/30 transition-colors cursor-row-resize" />

              <ResizablePanel defaultSize={35} minSize={15}>
                <ResultsPanel
                  testCases={activeProblem.test_cases}
                  results={results[activeProblem.id] ?? []}
                  score={scores[activeProblem.id]}
                  aiFeedback={aiFeedbacks[activeProblem.id] ?? null}
                  submitError={submitErrors[activeProblem.id] ?? null}
                  running={running}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Finish confirmation */}
      <AnimatePresence>
        {showFinish && (
          <FinishModal
            submittedCount={submittedProblems.size}
            totalCount={session.problems.length}
            onConfirm={() => finishMutation.mutate()}
            onCancel={() => setShowFinish(false)}
            isLoading={finishMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProblemDescription({ problem }: { problem: AssessProblem }) {
  const diffColor =
    problem.difficulty === "easy"
      ? "bg-difficulty-easy/10 text-difficulty-easy"
      : problem.difficulty === "medium"
      ? "bg-difficulty-medium/10 text-difficulty-medium"
      : "bg-difficulty-hard/10 text-difficulty-hard";

  const typeLabels: Record<string, string> = {
    write_code: "Write Code",
    fix_code: "Fix the Code",
    refactor: "Refactor",
    mcq: "MCQ",
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight leading-tight">{problem.title}</h1>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
            {problem.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {typeLabels[problem.type] ?? problem.type}
          </span>
          {problem.concept && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {problem.concept}
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      <TipTapRenderer content={problem.description} />

      {problem.function_signature && (
        <div>
          <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase mb-2">
            Function Signature
          </h3>
          <div className="font-mono text-[12px] border border-border/50 bg-muted rounded-lg p-3.5 overflow-x-auto">
            <span className="text-primary">def</span>{" "}
            <span className="text-foreground">{problem.function_signature.replace(/^(def|class)\s+/, "")}</span>
          </div>
        </div>
      )}

      {problem.examples.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Examples</h3>
          {problem.examples.map((ex, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-muted p-3.5 space-y-2">
              <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
                <p><span className="text-muted-foreground select-none">Input: </span><span>{ex.input}</span></p>
                <p><span className="text-muted-foreground select-none">Output: </span><span className="text-primary font-medium">{ex.output}</span></p>
              </div>
              {ex.explanation && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">{ex.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function McqPanel({
  problem,
  selectedOption,
  correctOption,
  score,
  running,
  onSelect,
  onSubmit,
}: {
  problem: AssessProblem;
  selectedOption: string | null;
  correctOption: string | null;
  score: number | undefined;
  running: boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
}) {
  const hasSubmitted = score !== undefined;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-muted/50 dark:bg-card/50 shrink-0">
        <span className="text-[11px] font-medium text-muted-foreground">Choose one answer</span>
        {hasSubmitted && (
          <span className={`text-[11px] font-semibold ${score === 100 ? "text-green-500" : "text-destructive"}`}>
            {score === 100 ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {problem.mcq_options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrect = correctOption === opt.id;
          const isWrong = hasSubmitted && isSelected && !isCorrect;
          const revealCorrect = hasSubmitted && isCorrect;

          let cardClass = "border-border/50 bg-card hover:border-border hover:bg-muted/30";
          let labelClass = "text-foreground/80";
          if (revealCorrect) {
            cardClass = "border-green-500/40 bg-green-500/5";
            labelClass = "text-green-600 dark:text-green-400 font-medium";
          } else if (isWrong) {
            cardClass = "border-destructive/40 bg-destructive/5";
            labelClass = "text-destructive font-medium";
          } else if (isSelected && !hasSubmitted) {
            cardClass = "border-primary/40 bg-primary/5";
            labelClass = "text-foreground font-medium";
          }

          return (
            <motion.button
              key={opt.id}
              onClick={() => !hasSubmitted && onSelect(opt.id)}
              disabled={hasSubmitted}
              whileTap={hasSubmitted ? {} : { scale: 0.99 }}
              className={`w-full text-left rounded-xl border p-3.5 cursor-pointer transition-all duration-300 disabled:cursor-default ${cardClass}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all duration-300 ${
                  revealCorrect
                    ? "border-green-500 bg-green-500"
                    : isWrong
                    ? "border-destructive bg-destructive"
                    : isSelected
                    ? "border-primary bg-primary"
                    : "border-border/60"
                }`}>
                  {(isSelected || revealCorrect) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-relaxed ${labelClass}`}>{opt.label}</p>
                  {opt.code && (
                    <pre className="mt-2 text-[11px] font-mono bg-muted/80 rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {opt.code}
                    </pre>
                  )}
                </div>
                {revealCorrect && <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                {isWrong && <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {!hasSubmitted && (
        <div className="px-4 py-3 border-t border-border/50 shrink-0">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onSubmit}
            disabled={!selectedOption || running}
            className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-500"
          >
            {running ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…</> : <><Send className="w-3.5 h-3.5" /> Submit Answer</>}
          </motion.button>
        </div>
      )}
    </div>
  );
}

function ResultsPanel({
  testCases,
  results,
  score,
  aiFeedback,
  submitError,
  running,
}: {
  testCases: { input: string }[];
  results: CandidateTestResult[];
  score: number | undefined;
  aiFeedback: string | null;
  submitError: string | null;
  running: boolean;
}) {
  const hasRun = score !== undefined;
  const passedCount = results.filter((r) => r.passed).length;
  const isAiReviewed = hasRun && results.length === 0;

  const scoreColor =
    score !== undefined
      ? score >= 80
        ? "text-green-500"
        : score >= 50
        ? "text-yellow-500"
        : "text-destructive"
      : "";

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-border bg-muted/30 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {running ? "Running…" : hasRun ? "Results" : "Test Cases"}
        </span>
        {score !== undefined && (
          <div className="flex items-center gap-2">
            {results.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {passedCount}/{results.length} passed
              </span>
            )}
            <span className={`text-[11px] font-semibold tabular-nums ${scoreColor}`}>
              {score}%
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* Running spinner */}
        {running && (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">Running tests…</span>
          </div>
        )}

        {/* Error from sandbox */}
        {!running && submitError && (
          <div className="rounded-lg bg-destructive/8 border border-destructive/20 p-3 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Error</p>
            <pre className="text-[11px] font-mono text-destructive/80 whitespace-pre-wrap break-words leading-relaxed">{submitError}</pre>
          </div>
        )}

        {/* AI feedback (no sandbox test results) */}
        {!running && isAiReviewed && aiFeedback && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">AI Review</span>
            </div>
            <p className="text-[12px] text-foreground/80 leading-relaxed">{aiFeedback}</p>
          </div>
        )}

        {/* Sandbox test results */}
        {!running && results.length > 0 && results.map((r, i) => (
          <div
            key={i}
            className={`rounded-lg border font-mono text-[11px] overflow-hidden ${
              r.passed
                ? "bg-green-500/5 border-green-500/20"
                : "bg-destructive/5 border-destructive/20"
            }`}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${r.passed ? "border-green-500/15 bg-green-500/5" : "border-destructive/15 bg-destructive/5"}`}>
              {r.passed
                ? <Check className="w-3 h-3 text-green-500 shrink-0" />
                : <X className="w-3 h-3 text-destructive shrink-0" />
              }
              <span className={`text-[10px] font-semibold ${r.passed ? "text-green-500" : "text-destructive"}`}>
                Test {i + 1} · {r.passed ? "Passed" : "Failed"}
              </span>
            </div>
            <div className="px-3 py-2 space-y-1">
              <div className="flex gap-2">
                <span className="text-muted-foreground/60 w-16 shrink-0">Input</span>
                <span className="text-foreground/80 break-all">{r.input}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground/60 w-16 shrink-0">Expected</span>
                <span className="text-foreground/80 break-all">{r.expected}</span>
              </div>
              {!r.passed && (
                <div className="flex gap-2">
                  <span className="text-destructive/70 w-16 shrink-0">Got</span>
                  <span className="text-destructive break-all">{r.actual}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Pre-run: show test case inputs */}
        {!running && !hasRun && testCases.map((tc, i) => (
          <div key={i} className="rounded-lg border border-border/50 bg-muted/40 font-mono text-[11px] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/40 bg-muted/60">
              <span className="text-muted-foreground/50 text-[10px] font-semibold">Test {i + 1}</span>
            </div>
            <div className="px-3 py-2 flex gap-2">
              <span className="text-muted-foreground/60 w-16 shrink-0">Input</span>
              <span className="text-foreground/70 break-all">{tc.input}</span>
            </div>
          </div>
        ))}

        {/* No test cases at all */}
        {!running && !hasRun && testCases.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[11px] text-muted-foreground">Submit to run the review.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FinishModal({
  submittedCount,
  totalCount,
  onConfirm,
  onCancel,
  isLoading,
}: {
  submittedCount: number;
  totalCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const unsubmitted = totalCount - submittedCount;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
    >
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card border border-border rounded-2xl w-full max-w-sm mx-4 p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          {unsubmitted > 0 ? (
            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-primary" />
            </div>
          )}
          <div>
            <p className="text-[14px] font-semibold">Finish assessment?</p>
            <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
              {unsubmitted > 0
                ? `You have ${unsubmitted} unsubmitted ${unsubmitted === 1 ? "problem" : "problems"}. Once finished you cannot make changes.`
                : "All problems submitted. This will lock your assessment."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 text-[12px] font-medium py-2 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
          >
            Keep working
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500"
          >
            {isLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Finishing…</> : "Finish"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Completed screen ──

function CompletedScreen({ session }: { session: AssessSession }) {
  const totalScore =
    session.submissions.length > 0
      ? Math.round(session.submissions.reduce((acc, s) => acc + s.score, 0) / session.submissions.length)
      : 0;

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-[22px] font-semibold tracking-tight">Assessment complete</h1>
          <p className="text-[13px] text-muted-foreground">
            Your responses have been submitted. The hiring team will be in touch.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 rounded-xl bg-card border border-border/60 space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Problems</p>
            <p className="text-[20px] font-semibold tabular-nums">{session.submissions.length}/{session.problems.length}</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-card border border-border/60 space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
            <p className={`text-[20px] font-semibold tabular-nums ${totalScore >= 80 ? "text-green-500" : totalScore >= 50 ? "text-yellow-500" : "text-destructive"}`}>
              {totalScore}%
            </p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-card border border-border/60 space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-[20px] font-semibold text-primary">Done</p>
          </div>
        </div>
        <a
          href="https://codetail.cc"
          className="block text-[12px] text-muted-foreground hover:text-foreground transition-all duration-500"
        >
          Powered by Codetail →
        </a>
      </motion.div>
    </div>
  );
}
