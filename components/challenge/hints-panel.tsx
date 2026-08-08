"use client";

import { useState } from "react";
import axios from "axios";
import { Lightbulb } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getHint } from "@/lib/api/submissions";
import { getErrorMessage } from "@/lib/api/client";
import { UpgradeModal } from "@/components/paths/upgrade-modal";
import type { SavedHint } from "@/lib/api/progress";

const LEVEL_STYLES: Record<string, string> = {
  gentle: "bg-brand-success/10 text-brand-success",
  medium: "bg-brand-warning/10 text-brand-warning",
  strong: "bg-brand-destructive/10 text-brand-destructive",
};

interface HintsPanelProps {
  problemId: string;
  code: string;
  initialHints: SavedHint[];
}

export function HintsPanel({ problemId, code, initialHints }: HintsPanelProps) {
  const [hints, setHints] = useState<SavedHint[]>(initialHints);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  async function handleGetHint() {
    setLoading(true);
    setError("");
    try {
      const result = await getHint(problemId, code);
      setHints((prev) => [...prev, result]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setUpgradeOpen(true);
      } else {
        setError(getErrorMessage(err, "Couldn't get a hint right now."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="text-sm font-semibold text-brand-text">Hints</p>

      {hints.length === 0 && !loading && (
        <p className="text-[12.5px] text-brand-text-muted">
          Stuck? Get a hint tailored to where you are right now.
        </p>
      )}

      {hints.map((h, i) => (
        <div key={i} className="rounded-lg border border-brand-border-strong p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1.5">
            Hint {h.hint_number}
            {" · "}
            <span className={`px-1.5 py-0.5 rounded normal-case ${LEVEL_STYLES[h.level] ?? "bg-brand-surface text-brand-text-muted"}`}>
              {h.level}
            </span>
          </p>
          <p className="text-[12.5px] leading-5 text-brand-text-muted">{h.hint}</p>
        </div>
      ))}

      {error && <p className="text-[12px] text-brand-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleGetHint}
        disabled={loading}
        className="flex items-center gap-1.5 text-[12px] font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover disabled:opacity-60 disabled:cursor-default"
      >
        {loading ? <Spinner size="sm" /> : <Lightbulb className="size-3.5" />}
        {hints.length === 0 ? "Get a hint" : "Get another hint"}
      </button>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="You've used today's free hints."
      />
    </div>
  );
}
