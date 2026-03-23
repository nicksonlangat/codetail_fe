"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, AlertTriangle } from "lucide-react";
import type { ChallengeContent } from "@/types";

interface ProblemDescriptionProps {
  content: ChallengeContent;
  showHints: boolean;
  onToggleHints: () => void;
}

export function ProblemDescription({
  content,
  showHints,
  onToggleHints,
}: ProblemDescriptionProps) {
  const challengeType = content.type;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-4">
        {/* Description */}
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Description
          </h2>
          <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
            {content.description?.split("```").map((part, i) =>
              i % 2 === 1 ? (
                <pre
                  key={i}
                  className="text-[11px] font-mono text-foreground/70 bg-secondary/50 rounded-lg p-3 my-2 overflow-x-auto leading-relaxed"
                >
                  {part.replace(/^python\n?/, "")}
                </pre>
              ) : (
                <span key={i}>{part}</span>
              ),
            ) ?? "No description available for this challenge yet."}
          </div>
        </div>

        {/* Issue description for fix-code */}
        {challengeType === "fix-code" && content.issueDescription && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
            <span className="text-[12px] text-foreground/80">
              {content.issueDescription}
            </span>
          </div>
        )}

        {/* Requirements */}
        {content.requirements && content.requirements.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
              {challengeType === "fix-code" ? "Issues to Fix" : "Requirements"}
            </h2>
            <div className="space-y-1.5">
              {content.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums mt-0.5 w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[12px] text-foreground/80 leading-relaxed">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example output */}
        {content.exampleOutput && (
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
              Example
            </h2>
            <pre className="text-[11px] font-mono text-foreground/70 bg-secondary/50 rounded-lg p-3 overflow-x-auto leading-relaxed">
              {content.exampleOutput}
            </pre>
          </div>
        )}

        {/* Hints */}
        {content.hints && content.hints.length > 0 && (
          <div>
            <button
              onClick={onToggleHints}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-75"
            >
              <Lightbulb className="w-3 h-3" />
              {showHints
                ? "Hide hints"
                : `Show ${content.hints.length} hint${content.hints.length > 1 ? "s" : ""}`}
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5 pl-1">
                    {content.hints.map((hint, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-[11px] text-muted-foreground"
                      >
                        <span className="text-primary/60">&#8226;</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
