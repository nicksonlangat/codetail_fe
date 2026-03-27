"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Lightbulb, Bot, BookOpen, Loader2 } from "lucide-react";
import type { ChallengeExample } from "@/types";
import { TestCasesPanel, type TestCaseResult } from "./test-cases-panel";
import { getHint, getReview, getSolution, type HintResponse, type ReviewResponse } from "@/lib/api/submissions";
import type { ReviewData } from "@/lib/api/progress";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

type Tab = "tests" | "hints" | "review" | "solution";

const tabs: { id: Tab; label: string; icon: typeof FlaskConical }[] = [
  { id: "tests", label: "Test Cases", icon: FlaskConical },
  { id: "hints", label: "Hints", icon: Lightbulb },
  { id: "review", label: "AI Review", icon: Bot },
  { id: "solution", label: "Solution", icon: BookOpen },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const levelColor: Record<string, string> = {
  gentle: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-600",
  strong: "bg-orange-500/10 text-orange-500",
};

interface BottomPanelProps {
  problemId: string;
  code: string;
  examples: ChallengeExample[];
  testResults: TestCaseResult[];
  running: boolean;
  stack?: string;
  triggerReview?: number;
  initialHints?: HintResponse[];
  initialReview?: ReviewData | null;
  initialSolution?: string | null;
}

export function BottomPanel({ problemId, code, examples, testResults, running, stack = "python", triggerReview = 0, initialHints = [], initialReview = null, initialSolution = null }: BottomPanelProps) {
  const isDjango = stack === "django";
  const [active, setActive] = useState<Tab>(isDjango ? "review" : "tests");
  const [hints, setHints] = useState<HintResponse[]>([]);
  const [hintsLoaded, setHintsLoaded] = useState(false);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [solutionHtml, setSolutionHtml] = useState<string | null>(null);
  const [solutionLoaded, setSolutionLoaded] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);

  useEffect(() => {
    if (initialHints.length > 0 && !hintsLoaded) {
      setHints(initialHints);
      setHintsLoaded(true);
    }
  }, [initialHints, hintsLoaded]);

  useEffect(() => {
    if (initialReview && !reviewLoaded) {
      setReview(initialReview as ReviewResponse);
      setReviewLoaded(true);
    }
  }, [initialReview, reviewLoaded]);

  useEffect(() => {
    if (initialSolution && !solutionLoaded) {
      setSolutionHtml(initialSolution);
      setSolutionLoaded(true);
    }
  }, [initialSolution, solutionLoaded]);

  const [loadingHint, setLoadingHint] = useState(false);
  const [hintError, setHintError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const handleGetHint = async () => {
    if (loadingHint || loadingReview) return;
    setLoadingHint(true);
    setHintError("");
    try {
      const hint = await getHint(problemId, code);
      setHints((prev) => [...prev, hint]);
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to get hint";
      if (err.response?.status === 429) {
        setUpgradeReason(detail);
        setShowUpgrade(true);
      } else {
        setHintError(detail);
      }
    } finally {
      setLoadingHint(false);
    }
  };

  // When parent triggers a review (e.g. Django "Submit for Review" button)
  useEffect(() => {
    if (triggerReview > 0 && !loadingReview && code.trim()) {
      setActive("review");
      handleGetReviewInner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReview]);

  const handleGetReviewInner = async () => {
    if (loadingReview || !code.trim()) return;
    setLoadingReview(true);
    try {
      const result = await getReview(problemId, code);
      setReview(result);
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to get review";
      if (err.response?.status === 429) {
        setUpgradeReason(detail);
        setShowUpgrade(true);
      }
    } finally {
      setLoadingReview(false);
    }
  };

  const handleGetReview = async () => {
    if (loadingReview || !code.trim()) return;
    setLoadingReview(true);
    try {
      const result = await getReview(problemId, code);
      setReview(result);
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to get review";
      if (err.response?.status === 429) {
        setUpgradeReason(detail);
        setShowUpgrade(true);
      }
    } finally {
      setLoadingReview(false);
    }
  };

  const handleGetSolution = async () => {
    if (loadingSolution) return;
    setLoadingSolution(true);
    try {
      const result = await getSolution(problemId);
      setSolutionHtml(result.html);
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to get solution";
      if (err.response?.status === 429) {
        setUpgradeReason(detail);
        setShowUpgrade(true);
      } else if (err.response?.status === 403) {
        // Not enough attempts — show inline message, not upgrade modal
        setSolutionHtml(null);
        setHintError(detail);
      }
    } finally {
      setLoadingSolution(false);
    }
  };


  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-2 border-b border-border bg-muted/50 dark:bg-card/50 dark:border-border/40 flex-shrink-0">
        {tabs.filter((tab) => !(isDjango && tab.id === "tests")).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
              {tab.id === "hints" && hints.length > 0 && (
                <span className="text-[9px] bg-primary/10 text-primary px-1 rounded-full">{hints.length}</span>
              )}
              {isActive && (
                <motion.div
                  layoutId="bottom-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {active === "tests" && (
          <TestCasesPanel examples={examples} results={testResults} running={running} />
        )}

        {active === "hints" && (
          <div className="p-4 space-y-3">
            {/* Previous hints */}
            <AnimatePresence>
              {hints.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Hint {h.hint_number}
                    </span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${levelColor[h.level] ?? ""}`}>
                      {h.level}
                    </span>
                  </div>
                  <p className="text-[12px] text-foreground/80 leading-relaxed">{h.hint}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Error */}
            {hintError && (
              <p className="text-[11px] text-destructive">{hintError}</p>
            )}

            {/* Get hint button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGetHint}
              disabled={loadingHint}
              className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50"
            >
              {loadingHint ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Lightbulb className="w-3 h-3" />
              )}
              {hints.length === 0 ? "Get Hint" : "Get Another Hint"}
            </motion.button>

            {hints.length === 0 && (
              <p className="text-[11px] text-muted-foreground/50">
                Hints are Socratic — they guide your thinking without giving the answer. Each hint gets progressively more specific.
              </p>
            )}
          </div>
        )}

        {active === "review" && (
          <div className="p-4 space-y-4">
            {review ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Score + summary */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono ${
                    review.score >= 90 ? "bg-green-500/10 text-green-500"
                    : review.score >= 70 ? "bg-primary/10 text-primary"
                    : review.score >= 50 ? "bg-yellow-500/10 text-yellow-600"
                    : "bg-red-500/10 text-red-500"
                  }`}>
                    {review.score}
                  </div>
                  <p className="text-[13px] text-foreground flex-1">{review.summary}</p>
                </div>

                {/* Strengths */}
                {review.strengths?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wide text-green-500 mb-1.5">Strengths</h4>
                    <div className="space-y-1">
                      {review.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {review.issues?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-1.5">Issues</h4>
                    <div className="space-y-1">
                      {review.issues.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {review.suggestions?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1.5">Next Steps</h4>
                    <div className="space-y-1">
                      {review.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Re-review button */}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGetReview} disabled={loadingReview}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50">
                  {loadingReview ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                  Review Again
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-muted-foreground">
                  Get detailed AI feedback on your code — correctness, style, patterns, and craft.
                </p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGetReview} disabled={loadingReview || !code.trim()}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50">
                  {loadingReview ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                  Request AI Review
                </motion.button>
              </div>
            )}
          </div>
        )}

        {active === "solution" && (
          <div className="p-4 space-y-3">
            {solutionHtml ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TipTapRenderer content={solutionHtml} />
              </motion.div>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-muted-foreground">
                  View the model solution with a step-by-step explanation of the approach, key insights, and complexity analysis.
                </p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGetSolution} disabled={loadingSolution}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50">
                  {loadingSolution ? <Loader2 className="w-3 h-3 animate-spin" /> : <BookOpen className="w-3 h-3" />}
                  View Solution
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={upgradeReason} />
    </div>
  );
}
