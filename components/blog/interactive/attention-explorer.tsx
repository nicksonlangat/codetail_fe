"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const TOKENS = ["The", "cat", "sat"];

// Toy 4-dim embeddings, hand-picked so the dot products are easy to verify by hand.
const X = [
  [1, 0, 1, 0], // The
  [0, 1, 0, 1], // cat
  [1, 1, 0, 0], // sat
];

const BAR_COLORS = ["var(--brand-chart-1)", "var(--brand-chart-2)", "var(--brand-chart-3)"];

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// Wq and Wk are the identity here, so Q = K = X: this makes the dot products
// directly traceable against the raw token vectors above. Wv scales values by 0.5.
// A real model learns all three matrices; this demo fixes them so the arithmetic
// stays checkable by hand.
const Q = X;
const K = X;
const V = X.map((row) => row.map((v) => v * 0.5));

const D_K = 4;

export function AttentionExplorer() {
  const [queryIdx, setQueryIdx] = useState(2);

  const { scores, weights, output } = useMemo(() => {
    const rawScores = K.map((k) => dot(Q[queryIdx], k) / Math.sqrt(D_K));
    const w = softmax(rawScores);
    const out = V[0].map((_, d) => w.reduce((sum, wi, i) => sum + wi * V[i][d], 0));
    return { scores: rawScores, weights: w, output: out };
  }, [queryIdx]);

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Self-attention, worked by hand</span>
        <span className="text-[9px] text-brand-text-subtle">toy vectors, fixed Wq/Wk so the math is checkable</span>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-[11px] text-brand-text-muted mb-1.5">Sentence: &ldquo;The cat sat&rdquo;. Pick the query token:</p>
          <div className="flex gap-1.5">
            {TOKENS.map((tok, i) => (
              <button
                key={tok}
                type="button"
                onClick={() => setQueryIdx(i)}
                className={`px-3 py-1 rounded-lg text-[12px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                  i === queryIdx
                    ? "bg-brand-primary text-white"
                    : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
                }`}
              >
                {tok}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-brand-text-subtle">
            Attention weights, softmax(Q&middot;K / &radic;d)
          </p>
          {TOKENS.map((tok, i) => (
            <div key={tok} className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-brand-text-muted w-10 shrink-0">{tok}</span>
              <div className="flex-1 h-4 rounded bg-brand-surface overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: BAR_COLORS[i] }}
                  animate={{ width: `${weights[i] * 100}%` }}
                  transition={SPRING}
                />
              </div>
              <span className="text-[10px] font-mono text-brand-text-muted w-20 text-right shrink-0">
                score {scores[i].toFixed(2)} &rarr; {(weights[i] * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted">
          output for &ldquo;{TOKENS[queryIdx]}&rdquo; = {weights.map((w) => w.toFixed(2)).join(" · ")} weighted
          sum of the value vectors ={" "}
          <span className="text-brand-text font-semibold">[{output.map((v) => v.toFixed(3)).join(", ")}]</span>
        </div>
      </div>
    </div>
  );
}
