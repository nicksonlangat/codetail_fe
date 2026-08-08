"use client";

import { useState } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getSolution } from "@/lib/api/submissions";
import { getErrorMessage } from "@/lib/api/client";
import { UpgradeModal } from "@/components/paths/upgrade-modal";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { PROSE_CLASS } from "./prose-styles";

interface SolutionPanelProps {
  problemId: string;
  initialSolution: string | null;
}

export function SolutionPanel({ problemId, initialSolution }: SolutionPanelProps) {
  const [html, setHtml] = useState(initialSolution);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  async function handleReveal() {
    setLoading(true);
    setError("");
    try {
      const result = await getSolution(problemId);
      setHtml(result.html);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setUpgradeOpen(true);
      } else {
        setError(getErrorMessage(err, "Couldn't load the solution right now."));
      }
    } finally {
      setLoading(false);
    }
  }

  if (html) {
    return (
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-brand-text mb-2">Reference solution</p>
        <TipTapRenderer content={html} className={PROSE_CLASS} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 px-4 py-6 text-center">
      <BookOpen className="size-5 text-brand-text-subtle" />
      <p className="text-[12.5px] text-brand-text-muted max-w-56">
        Get a full walkthrough and reference implementation for this problem.
      </p>
      {error && <p className="text-[12px] text-brand-destructive">{error}</p>}
      <button
        type="button"
        onClick={handleReveal}
        disabled={loading}
        className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-brand-primary px-3.5 py-2 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-default"
      >
        {loading && <Spinner size="sm" />}
        View solution
      </button>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="You've used today's free solution reveals."
      />
    </div>
  );
}
