"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { submitMcq } from "@/lib/api/submissions";
import { getErrorMessage } from "@/lib/api/client";
import type { McqOption } from "@/lib/api/problems";

interface McqResult {
  correct: boolean;
  correct_answer: string;
  explanation: string | null;
}

interface McqPanelProps {
  problemId: string;
  options: McqOption[];
  initialSelected: string | null;
  alreadySolved: boolean;
  explanation: string | null;
  onSolved: (xpEarned: number, badges: string[]) => void;
}

export function McqPanel({
  problemId,
  options,
  initialSelected,
  alreadySolved,
  explanation,
  onSolved,
}: McqPanelProps) {
  const [selected, setSelected] = useState(initialSelected);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<McqResult | null>(
    alreadySolved && initialSelected
      ? { correct: true, correct_answer: initialSelected, explanation }
      : null
  );

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await submitMcq(problemId, selected);
      setResult(res);
      if (res.correct) onSolved(res.xp_earned, res.newly_earned_badges);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't submit your answer."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleTryAgain() {
    setSelected(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="p-6 space-y-2.5">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        const isCorrectAnswer = result && opt.id === result.correct_answer;
        const isWrongPick = result && !result.correct && isSelected;

        return (
          <button
            key={opt.id}
            type="button"
            disabled={!!result}
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left rounded-lg border p-3.5 transition-all duration-500 ${
              result ? "cursor-default" : "cursor-pointer"
            } ${
              isCorrectAnswer
                ? "border-brand-success/50 bg-brand-success/5"
                : isWrongPick
                  ? "border-brand-destructive/50 bg-brand-destructive/5"
                  : isSelected
                    ? "border-brand-primary/50 bg-brand-primary/5"
                    : "border-brand-border-strong hover:bg-brand-surface/50"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {result ? (
                isCorrectAnswer ? (
                  <CheckCircle2 className="size-4 text-brand-success shrink-0 mt-0.5" />
                ) : isWrongPick ? (
                  <XCircle className="size-4 text-brand-destructive shrink-0 mt-0.5" />
                ) : (
                  <span className="size-4 shrink-0" />
                )
              ) : (
                <span
                  className={`size-4 rounded-full border shrink-0 mt-0.5 ${
                    isSelected ? "border-brand-primary bg-brand-primary" : "border-brand-border-strong"
                  }`}
                />
              )}
              <div className="min-w-0">
                <p className="text-[13px] text-brand-text">{opt.label}</p>
                {opt.code && (
                  <code className="block mt-1.5 font-mono text-[12px] bg-brand-surface rounded px-2 py-1 text-brand-text overflow-x-auto">
                    {opt.code}
                  </code>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {error && <p className="text-[12px] text-brand-destructive">{error}</p>}

      {result?.explanation && (
        <div
          className={`rounded-lg border p-3.5 ${
            result.correct
              ? "border-brand-success/30 bg-brand-success/5"
              : "border-brand-warning/30 bg-brand-warning/5"
          }`}
        >
          <p className="text-[12.5px] leading-5 text-brand-text">{result.explanation}</p>
        </div>
      )}

      {!result ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-brand-primary px-4 py-2.5 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-default"
        >
          {submitting && <Spinner size="sm" />}
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={handleTryAgain}
          className="flex items-center gap-1.5 text-[12px] font-medium text-brand-text-muted cursor-pointer outline-none transition-all duration-500 hover:text-brand-text"
        >
          <RotateCcw className="size-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
