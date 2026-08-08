"use client";

import { useMemo, useState } from "react";

const TOKENS = ["cat", "sat", "on", "the", "mat"];

const PRESETS: { id: string; label: string; probs: number[] }[] = [
  { id: "confident", label: "Confident model", probs: [0.9, 0.85, 0.92, 0.88, 0.8] },
  { id: "uncertain", label: "Uncertain model", probs: [0.3, 0.25, 0.35, 0.2, 0.28] },
  { id: "mixed", label: "Mixed", probs: [0.9, 0.4, 0.7, 0.2, 0.6] },
];

export function PerplexityCalculator() {
  const [probs, setProbs] = useState<number[]>([0.9, 0.85, 0.92, 0.88, 0.8]);

  const losses = useMemo(() => probs.map((p) => -Math.log(p)), [probs]);
  const avgLoss = useMemo(() => losses.reduce((a, b) => a + b, 0) / losses.length, [losses]);
  const perplexity = Math.exp(avgLoss);

  function setProb(i: number, value: number) {
    setProbs((prev) => prev.map((p, j) => (j === i ? value : p)));
  }

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">
          Predicting &ldquo;The cat sat on the mat&rdquo;, one token at a time
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setProbs(preset.probs)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none bg-brand-surface text-brand-text-muted hover:text-brand-text"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {TOKENS.map((token, i) => (
            <div key={token} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-brand-text-muted">
                  P(&ldquo;{token}&rdquo; | previous tokens)
                </span>
                <span className="text-[10px] font-mono text-brand-text">
                  {probs[i].toFixed(2)} &middot; loss {losses[i].toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.02}
                max={0.99}
                step={0.01}
                value={probs[i]}
                onChange={(e) => setProb(i, Number(e.target.value))}
                className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
              />
            </div>
          ))}
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted space-y-1">
          <div>
            avg loss = ({losses.map((l) => l.toFixed(2)).join(" + ")}) / 5 ={" "}
            <span className="text-brand-text font-semibold">{avgLoss.toFixed(3)}</span>
          </div>
          <div>
            perplexity = e^{avgLoss.toFixed(3)} ={" "}
            <span className="text-brand-text font-semibold">{perplexity.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-[10px] text-brand-text-subtle">
          Drag any one slider down toward an unconfident guess and watch perplexity climb. One
          weak prediction is enough to raise the average uncertainty across the whole sequence,
          the same way one bad step drags down the model&apos;s score on the full test set.
        </p>
      </div>
    </div>
  );
}
