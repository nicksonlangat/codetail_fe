"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import type { ChallengeContent } from "@/types";

interface ProblemDescriptionProps {
  content: ChallengeContent;
  meta: { title: string; difficulty: string; type: string; concept: string };
  diffColor: string;
  typeLabel: string;
  showHints: boolean;
  onToggleHints: () => void;
}

export function ProblemDescription({ content, meta, diffColor, typeLabel }: ProblemDescriptionProps) {
  const isHtml = content.description?.startsWith("<");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="px-7 py-6 space-y-5">
        {/* Title + badges */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight leading-tight">
            {meta.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
              {meta.difficulty}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {typeLabel}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {meta.concept}
            </span>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Description */}
        {isHtml ? (
          <TipTapRenderer content={content.description} />
        ) : (
          <div className="text-[13px] text-foreground/80 leading-[1.7]">
            {content.description ?? "No description available."}
          </div>
        )}

        {/* Issue description for fix-code */}
        {content.type === "fix-code" && content.issueDescription && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
            <span className="text-[12px] text-foreground/80">{content.issueDescription}</span>
          </div>
        )}

        {/* Function Signature */}
        {content.functionSignature && (
          <div>
            <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase mb-2">
              Function Signature
            </h3>
            <div className="font-mono text-[12px] border border-border bg-muted/30 rounded-lg p-3.5 overflow-x-auto">
              <span className="text-primary">def</span>{" "}
              <span className="text-foreground">{content.functionSignature.replace(/^(def|class)\s+/, "")}</span>
            </div>
          </div>
        )}

        {/* Examples */}
        {content.examples?.length > 0 && (
          <div className="space-y-3">
            {content.examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-2"
              >
                <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                  Example {i + 1}
                </h3>
                <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
                  <p>
                    <span className="text-muted-foreground select-none">Input: </span>
                    <span className="text-foreground">{ex.input}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground select-none">Output: </span>
                    <span className="text-primary font-medium">{ex.output}</span>
                  </p>
                </div>
                {ex.explanation && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {ex.explanation}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
