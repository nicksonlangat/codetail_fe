"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Candidate = { token: string; prob: number };

const PROMPTS: { id: string; text: string; candidates: Candidate[] }[] = [
  {
    id: "cat",
    text: "The cat sat on the",
    candidates: [
      { token: "mat", prob: 0.42 },
      { token: "floor", prob: 0.18 },
      { token: "couch", prob: 0.11 },
      { token: "table", prob: 0.07 },
      { token: "roof", prob: 0.05 },
      { token: "ground", prob: 0.04 },
      { token: "chair", prob: 0.03 },
      { token: "wall", prob: 0.02 },
      { token: "window", prob: 0.01 },
      { token: "other", prob: 0.07 },
    ],
  },
  {
    id: "story",
    text: "Once upon a",
    candidates: [
      { token: "time", prob: 0.71 },
      { token: "midnight", prob: 0.06 },
      { token: "dream", prob: 0.05 },
      { token: "princess", prob: 0.04 },
      { token: "dark", prob: 0.03 },
      { token: "cold", prob: 0.03 },
      { token: "distant", prob: 0.02 },
      { token: "king", prob: 0.02 },
      { token: "small", prob: 0.02 },
      { token: "other", prob: 0.02 },
    ],
  },
  {
    id: "arithmetic",
    text: "2 + 2 =",
    candidates: [
      { token: "4", prob: 0.86 },
      { token: "five", prob: 0.04 },
      { token: "22", prob: 0.03 },
      { token: "5", prob: 0.02 },
      { token: "6", prob: 0.02 },
      { token: "3", prob: 0.01 },
      { token: "42", prob: 0.01 },
      { token: "1", prob: 0.01 },
    ],
  },
  {
    id: "capital",
    text: "The capital of France is",
    candidates: [
      { token: "Paris", prob: 0.93 },
      { token: "Lyon", prob: 0.02 },
      { token: "home", prob: 0.01 },
      { token: "located", prob: 0.01 },
      { token: "actually", prob: 0.01 },
      { token: "a", prob: 0.01 },
      { token: "not", prob: 0.01 },
    ],
  },
];

const BAR_COLORS = [
  "var(--brand-chart-1)",
  "var(--brand-chart-2)",
  "var(--brand-chart-3)",
  "var(--brand-chart-4)",
  "var(--brand-chart-5)",
  "var(--brand-chart-6)",
];

function reweight(candidates: Candidate[], temperature: number): Candidate[] {
  const scaled = candidates.map((c) => Math.exp(Math.log(c.prob) / temperature));
  const sum = scaled.reduce((a, b) => a + b, 0);
  return candidates
    .map((c, i) => ({ token: c.token, prob: scaled[i] / sum }))
    .sort((a, b) => b.prob - a.prob);
}

function sampleFrom(distribution: Candidate[]): string {
  const r = Math.random();
  let cumulative = 0;
  for (const c of distribution) {
    cumulative += c.prob;
    if (r <= cumulative) return c.token;
  }
  return distribution[distribution.length - 1].token;
}

export function NextTokenPredictor() {
  const [promptId, setPromptId] = useState("cat");
  const [temperature, setTemperature] = useState(1.0);
  const [sampled, setSampled] = useState<string | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId)!;
  const distribution = useMemo(() => reweight(prompt.candidates, temperature), [prompt, temperature]);

  const handlePromptChange = (id: string) => {
    setPromptId(id);
    setSampled(null);
  };

  const handleSample = () => {
    setSampled(sampleFrom(distribution));
  };

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Next-token probability distribution</span>
        <span className="text-[9px] text-brand-text-subtle">illustrative, not a live model</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePromptChange(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                p.id === promptId
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {p.text} ___
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[11px] text-brand-text-muted">Temperature</span>
            <span className="text-[11px] font-mono font-semibold text-brand-text">{temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
          />
        </div>

        <div className="space-y-1.5">
          {distribution.map((c, i) => (
            <div key={c.token} className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-brand-text-muted w-14 shrink-0 truncate">{c.token}</span>
              <div className="flex-1 h-4 rounded bg-brand-surface overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                  animate={{ width: `${c.prob * 100}%` }}
                  transition={SPRING}
                />
              </div>
              <span className="text-[10px] font-mono text-brand-text-muted w-12 text-right shrink-0">
                {(c.prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <motion.button
            type="button"
            onClick={handleSample}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-brand-primary text-white cursor-pointer outline-none"
          >
            Sample next token
          </motion.button>
          <AnimatePresence mode="wait">
            {sampled && (
              <motion.span
                key={sampled}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={SPRING}
                className="text-[12px] font-mono text-brand-text"
              >
                {prompt.text} <span className="text-brand-primary font-semibold">{sampled}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
