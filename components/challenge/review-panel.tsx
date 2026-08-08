"use client";

import { useState } from "react";
import axios from "axios";
import { CheckCircle2, WandSparkles, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getReview } from "@/lib/api/submissions";
import { getErrorMessage } from "@/lib/api/client";
import { UpgradeModal } from "@/components/paths/upgrade-modal";
import type { ReviewAttributes } from "@/lib/api/submissions";

export interface ReviewDisplay {
  score: number;
  attributes: ReviewAttributes | null;
  summary: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

const SCORE_STYLES = (score: number) =>
  score >= 90
    ? "bg-brand-success/10 text-brand-success"
    : score >= 70
      ? "bg-brand-primary/10 text-brand-primary"
      : score >= 50
        ? "bg-brand-warning/10 text-brand-warning"
        : "bg-brand-destructive/10 text-brand-destructive";

const ATTRIBUTE_LABELS: Record<keyof ReviewAttributes, string> = {
  correctness: "Correctness",
  design: "Design",
  clarity: "Clarity",
  efficiency: "Efficiency",
};

interface ReviewPanelProps {
  problemId: string;
  code: string;
  initialReview: ReviewDisplay | null;
  onSolved: (xpEarned: number, badges: string[]) => void;
}

export function ReviewPanel({ problemId, code, initialReview, onSolved }: ReviewPanelProps) {
  const [review, setReview] = useState<ReviewDisplay | null>(initialReview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  async function handleReview() {
    setLoading(true);
    setError("");
    try {
      const result = await getReview(problemId, code);
      setReview(result);
      if (result.xp_earned > 0) {
        onSolved(result.xp_earned, result.newly_earned_badges);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setUpgradeOpen(true);
      } else {
        setError(getErrorMessage(err, "Couldn't get a review right now."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-text flex items-center gap-1.5">
          <WandSparkles className="size-3.5 text-brand-primary" /> AI Review
        </p>
        {review && (
          <span className={`rounded-md text-[11px] font-semibold px-2 py-0.5 ${SCORE_STYLES(review.score)}`}>
            {review.score} / 100
          </span>
        )}
      </div>

      {!review && !loading && (
        <p className="text-[12.5px] text-brand-text-muted">
          Get qualitative feedback on correctness, design, clarity, and efficiency, not just
          pass/fail.
        </p>
      )}

      {review && (
        <>
          <p className="text-[12.5px] leading-5 text-brand-text-muted">{review.summary}</p>

          {review.attributes && (
            <div className="space-y-1.5">
              {(Object.entries(review.attributes) as [keyof ReviewAttributes, number][]).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-[11px]">
                    <span className="w-16 text-brand-text-muted shrink-0">{ATTRIBUTE_LABELS[key]}</span>
                    <div className="flex-1 h-1.5 bg-brand-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-brand-text-subtle tabular-nums w-7 text-right shrink-0">
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          <div className="space-y-1.5">
            {review.strengths.map((s, i) => (
              <div key={`s-${i}`} className="flex items-center gap-2 text-[12px] text-brand-text">
                <CheckCircle2 className="size-3.5 text-brand-success shrink-0" />
                {s}
              </div>
            ))}
            {review.issues.map((s, i) => (
              <div key={`i-${i}`} className="flex items-center gap-2 text-[12px] text-brand-text">
                <XCircle className="size-3.5 text-brand-destructive shrink-0" />
                {s}
              </div>
            ))}
            {review.suggestions.map((s, i) => (
              <div key={`g-${i}`} className="flex items-center gap-2 text-[12px] text-brand-text-muted">
                <span className="text-brand-text-subtle shrink-0">&rarr;</span>
                {s}
              </div>
            ))}
          </div>
        </>
      )}

      {error && <p className="text-[12px] text-brand-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleReview}
        disabled={loading}
        className="flex items-center gap-1.5 text-[12px] font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover disabled:opacity-60 disabled:cursor-default"
      >
        {loading ? <Spinner size="sm" /> : <WandSparkles className="size-3.5" />}
        {review ? "Review again" : "Get AI review"}
      </button>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="You've used today's free AI reviews."
      />
    </div>
  );
}
