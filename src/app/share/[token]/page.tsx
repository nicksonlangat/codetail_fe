"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Send, Share2, X, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  getShare,
  submitViaShare,
  getShareSubmissions,
  type ShareSubmissionResponse,
} from "@/lib/api/share";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";
import { ShareSubmissionsPanel } from "./submissions-panel";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { TestCasesPanel, type TestCaseResult } from "@/components/challenge/test-cases-panel";


export default function SharePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [code, setCode] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [running, setRunning] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ShareSubmissionResponse | null>(null);

  const { data: shared, isLoading, error } = useQuery({
    queryKey: ["share", token],
    queryFn: () => getShare(token),
    enabled: !!token,
  });

  // Initialize editor code once on first load
  useEffect(() => {
    if (shared && code === null) {
      setCode(shared.starter_code ?? "");
    }
  }, [shared]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: submissions = [], refetch: refetchSubmissions } = useQuery({
    queryKey: ["share-submissions", token],
    queryFn: () => getShareSubmissions(token),
    enabled: !!token,
    refetchInterval: 10000,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      setRunning(true);
      setTestResults([]);
      setSubmitError(null);
      return submitViaShare(token, code ?? "");
    },
    onSuccess: (res) => {
      setTestResults(res.test_results.map((r) => ({ input: r.input, expected: r.expected, actual: r.actual, passed: r.passed })));
      setRunning(false);
      refetchSubmissions();
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.detail ?? "Submission failed");
      setRunning(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (error || !shared) {
    const status = (error as any)?.response?.status;
    const msg = status === 410
      ? "This share link has expired."
      : status === 403
      ? "This link is private. You don't have access."
      : "Share link not found.";
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-[16px] font-semibold text-foreground">{msg}</p>
          <p className="text-[13px] text-muted-foreground">Ask the sender for a new link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between h-12 px-5 border-b border-border/60 bg-card/50 shrink-0">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 cursor-pointer group">
          <span className="text-[14px] font-black tracking-tight text-foreground group-hover:text-primary transition-all duration-500">
            Codetail
          </span>
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/40 font-medium">
            <span className="text-muted-foreground/20">·</span>
            <Share2 className="w-2.5 h-2.5" />
            shared challenge
          </span>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <TopBarAuth />
          <div className="w-px h-4 bg-border/40" />
          <ThemeToggle />
        </div>
      </div>

      {/* Main split */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        {/* Left: problem + editor */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full overflow-y-auto px-6 py-5 space-y-4">
                <ProblemDescription shared={shared} />
              </div>
            </ResizablePanel>
            <ResizableHandle className="h-1 bg-border hover:bg-primary/30 transition-colors cursor-row-resize" />
            <ResizablePanel defaultSize={60} minSize={30}>
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize={65} minSize={30}>
                  <div className="flex flex-col h-full min-h-0">
                    <div className="flex items-center justify-between px-3 h-10 border-b border-border bg-muted/50 dark:bg-card/50 shrink-0">
                      <span className="text-[11px] font-medium text-muted-foreground px-1">Python — main.py</span>
                      <div className="flex items-center gap-2">
                        {submitError && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                            {submitError}
                          </span>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => submitMutation.mutate()}
                          disabled={submitMutation.isPending}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500"
                        >
                          {submitMutation.isPending
                            ? <><Loader2 className="w-3 h-3 animate-spin" /> Running...</>
                            : <><Send className="w-3 h-3" /> Submit</>
                          }
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <MonacoCodeEditor
                        value={code ?? ""}
                        onChange={(v) => setCode(v)}
                        language="python"
                      />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle className="h-1 bg-border hover:bg-primary/30 transition-colors cursor-row-resize" />
                <ResizablePanel defaultSize={35} minSize={20}>
                  <TestCasesPanel
                    examples={(shared.examples ?? []).map((e) => ({ input: e.input, output: e.output, explanation: e.explanation ?? undefined }))}
                    results={testResults}
                    running={running}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-primary/30 transition-colors cursor-col-resize" />

        {/* Right: submissions + comments */}
        <ResizablePanel defaultSize={45} minSize={25}>
          <ShareSubmissionsPanel
            token={token}
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onSelect={setSelectedSubmission}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <GuestBanner />
    </div>
  );
}

function TopBarAuth() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/paths"
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
        >
          Paths
        </a>
        <div className="w-px h-3 bg-border/40" />
        <span className="text-[11px] text-muted-foreground/60">{user?.name ?? user?.email}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <a
        href="/paths"
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-secondary cursor-pointer transition-all duration-500"
      >
        Explore
      </a>
      <a
        href="/login"
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
      >
        Log in
      </a>
      <a
        href="/register"
        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
      >
        Sign up free
      </a>
    </div>
  );
}

const BANNER_KEY = "codetail_share_banner_dismissed";

function GuestBanner() {
  const { isAuthenticated } = useAuthStore();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(BANNER_KEY) === "1";
  });

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, "1");
    setDismissed(true);
  };

  if (isAuthenticated || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 1.5 }}
        className="absolute bottom-0 inset-x-0 z-40 px-5 pb-5 pointer-events-none"
      >
        <div className="max-w-2xl mx-auto bg-foreground dark:bg-card rounded-2xl border border-border/20 px-6 py-4 flex items-center gap-6 shadow-2xl pointer-events-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-background dark:text-foreground leading-tight mb-0.5">
              Practice like this every day
            </p>
            <p className="text-[11px] text-background/50 dark:text-muted-foreground leading-relaxed">
              Codetail has 200+ challenges across Python, Django, and more — with AI feedback on every submission.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/paths"
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg text-background/60 dark:text-muted-foreground hover:text-background dark:hover:text-foreground cursor-pointer transition-all duration-500"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Explore paths
            </a>
            <a
              href="/register"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
            >
              Sign up free <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-background/30 dark:text-muted-foreground hover:text-background dark:hover:text-foreground cursor-pointer transition-all duration-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProblemDescription({ shared }: { shared: any }) {
  const diffColor = shared.difficulty === "easy"
    ? "bg-difficulty-easy/10 text-difficulty-easy"
    : shared.difficulty === "medium"
    ? "bg-difficulty-medium/10 text-difficulty-medium"
    : "bg-difficulty-hard/10 text-difficulty-hard";

  const typeLabels: Record<string, string> = {
    write_code: "Write Code",
    mcq: "Multiple Choice",
    fix_code: "Fix the Code",
    refactor: "Refactor",
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight leading-tight">{shared.title}</h1>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
            {shared.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {typeLabels[shared.type] ?? shared.type}
          </span>
          {shared.concept && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {shared.concept}
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      <TipTapRenderer content={shared.description ?? ""} />

      {shared.function_signature && (
        <div>
          <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase mb-2">
            Function Signature
          </h3>
          <div className="font-mono text-[12px] border border-border/50 bg-muted rounded-lg p-3.5 overflow-x-auto">
            <span className="text-primary">def</span>{" "}
            <span className="text-foreground">{shared.function_signature.replace(/^(def|class)\s+/, "")}</span>
          </div>
        </div>
      )}

      {shared.examples?.length > 0 && (
        <div className="space-y-3">
          {shared.examples.map((ex: any, i: number) => (
            <div key={i} className="rounded-lg border border-border/50 bg-muted p-3.5 space-y-2">
              <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                Example {i + 1}
              </h3>
              <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
                <p><span className="text-muted-foreground select-none">Input: </span><span className="text-foreground">{ex.input}</span></p>
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
