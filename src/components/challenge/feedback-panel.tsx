"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Loader2 } from "lucide-react";
import type { Feedback, FeedbackStatus } from "@/types";

interface FeedbackPanelProps {
  feedback: Feedback | null;
  status: FeedbackStatus;
}

export function FeedbackPanel({ feedback, status }: FeedbackPanelProps) {
  if (status === "idle") return null;

  return (
    <div className="h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        {status === "evaluating" ? (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-6 flex flex-col items-center justify-center gap-2"
          >
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-[12px] text-muted-foreground">
              Evaluating your solution...
            </span>
          </motion.div>
        ) : feedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-4"
          >
            {/* Pass / Fail badge with score */}
            <div className="flex items-center gap-2 mb-3">
              {feedback.status === "pass" ? (
                <div className="flex items-center gap-1.5 text-difficulty-easy">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[13px] font-semibold">Passed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-difficulty-hard">
                  <XCircle className="w-4 h-4" />
                  <span className="text-[13px] font-semibold">Needs Work</span>
                </div>
              )}
              <span className="text-[11px] text-muted-foreground/50 font-mono">
                {feedback.score}/100
              </span>
            </div>

            {/* Summary */}
            <p className="text-[12px] text-foreground/80 leading-relaxed mb-3">
              {feedback.summary}
            </p>

            {/* Points list */}
            <div className="space-y-1.5 mb-3">
              {feedback.points.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  {p.pass ? (
                    <CheckCircle2 className="w-3 h-3 text-difficulty-easy flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-3 h-3 text-difficulty-hard flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[11px] font-medium text-foreground">
                      {p.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-1.5">
                      — {p.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestion */}
            {feedback.suggestion && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-accent/30 ring-1 ring-primary/10">
                <Lightbulb className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-foreground/70">
                  {feedback.suggestion}
                </span>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
