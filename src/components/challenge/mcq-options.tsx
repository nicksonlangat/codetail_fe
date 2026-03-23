"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { McqOption } from "@/types";

interface McqOptionsProps {
  options: McqOption[];
  selectedOption: string | null;
  onSelect: (id: string) => void;
  submitted: boolean;
  correctOptionId?: string;
  explanation?: string;
}

export function McqOptions({
  options,
  selectedOption,
  onSelect,
  submitted,
  correctOptionId,
  explanation,
}: McqOptionsProps) {
  const isCorrect = selectedOption === correctOptionId;

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
        Select Your Answer
      </h2>

      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrectOption = opt.id === correctOptionId;

          let borderClass =
            "ring-border/60 hover:ring-primary/40 hover:bg-secondary/50";
          if (submitted && isCorrectOption)
            borderClass = "ring-difficulty-easy/60 bg-difficulty-easy/5";
          else if (submitted && isSelected && !isCorrectOption)
            borderClass = "ring-destructive/60 bg-destructive/5";
          else if (isSelected) borderClass = "ring-primary bg-primary/5";

          return (
            <button
              key={opt.id}
              onClick={() => !submitted && onSelect(opt.id)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg ring-1 transition-all duration-150 ${borderClass}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full ring-1 flex items-center justify-center flex-shrink-0 ${
                    submitted && isCorrectOption
                      ? "ring-difficulty-easy bg-difficulty-easy/20"
                      : submitted && isSelected
                        ? "ring-destructive bg-destructive/20"
                        : isSelected
                          ? "ring-primary bg-primary/20"
                          : "ring-border"
                  }`}
                >
                  {submitted && isCorrectOption && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-difficulty-easy" />
                  )}
                  {submitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                  {!submitted && isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-[13px] font-medium text-foreground">
                    {opt.label}
                  </span>
                  {opt.code && (
                    <pre className="text-[11px] font-mono text-muted-foreground mt-1 whitespace-pre-wrap">
                      {opt.code}
                    </pre>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result after submission */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 mt-4"
        >
          <div
            className={`flex items-center gap-2 ${isCorrect ? "text-difficulty-easy" : "text-destructive"}`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span className="text-[13px] font-semibold">
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          </div>

          {explanation && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-accent/30 ring-1 ring-primary/10">
              <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-[12px] text-foreground/80 leading-relaxed">
                {explanation}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
