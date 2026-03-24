"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Lightbulb, Bot, BookOpen, Loader2 } from "lucide-react";
import type { ChallengeExample } from "@/types";
import { TestCasesPanel, type TestCaseResult } from "./test-cases-panel";
import { getHint, type HintResponse } from "@/lib/api/submissions";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

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
  initialHints?: HintResponse[];
}

export function BottomPanel({ problemId, code, examples, testResults, running, initialHints = [] }: BottomPanelProps) {
  const [active, setActive] = useState<Tab>("tests");
  const [hints, setHints] = useState<HintResponse[]>(initialHints);
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintError, setHintError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const handleGetHint = async () => {
    if (loadingHint) return;
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-2 border-b border-border/40 bg-card/50 flex-shrink-0">
        {tabs.map((tab) => {
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
          <div className="p-4 space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Submit your code first, then get detailed AI feedback on your approach, style, and correctness.
            </p>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
              <Bot className="w-3 h-3" />
              Request AI Review
            </button>
          </div>
        )}

        {active === "solution" && (
          <div className="p-4 space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Try solving the problem first. The solution will be available after 3 attempts or when you solve it.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40">
              <BookOpen className="w-3 h-3" />
              Locked — solve or attempt 3 times to unlock
            </div>
          </div>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={upgradeReason} />
    </div>
  );
}
