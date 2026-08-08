"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Candidate = { token: string; prob: number };
type ScoredCandidate = Candidate & { survives: boolean; cutBy: "top-k" | "top-p" | null };

const PRESETS: { id: string; text: string; candidates: Candidate[] }[] = [
  {
    id: "peaked",
    text: "The capital of France is",
    candidates: [
      { token: "Paris", prob: 0.8 },
      { token: "Lyon", prob: 0.05 },
      { token: "home", prob: 0.04 },
      { token: "located", prob: 0.03 },
      { token: "actually", prob: 0.03 },
      { token: "a", prob: 0.02 },
      { token: "not", prob: 0.01 },
      { token: "definitely", prob: 0.01 },
      { token: "clearly", prob: 0.005 },
      { token: "obviously", prob: 0.005 },
    ],
  },
  {
    id: "flat",
    text: "My favorite hobby is",
    candidates: [
      { token: "reading", prob: 0.16 },
      { token: "painting", prob: 0.14 },
      { token: "cooking", prob: 0.13 },
      { token: "hiking", prob: 0.12 },
      { token: "gaming", prob: 0.11 },
      { token: "gardening", prob: 0.1 },
      { token: "writing", prob: 0.09 },
      { token: "cycling", prob: 0.08 },
      { token: "coding", prob: 0.05 },
      { token: "dancing", prob: 0.02 },
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

function applyTemperature(candidates: Candidate[], temperature: number): Candidate[] {
  const scaled = candidates.map((c) => Math.exp(Math.log(c.prob) / temperature));
  const sum = scaled.reduce((a, b) => a + b, 0);
  return candidates
    .map((c, i) => ({ token: c.token, prob: scaled[i] / sum }))
    .sort((a, b) => b.prob - a.prob);
}

function applyCutoffs(
  distribution: Candidate[],
  topKEnabled: boolean,
  topK: number,
  topPEnabled: boolean,
  topP: number
): ScoredCandidate[] {
  const scored: ScoredCandidate[] = distribution.map((c) => ({ ...c, survives: true, cutBy: null }));

  if (topKEnabled) {
    scored.forEach((c, i) => {
      if (i >= topK) {
        c.survives = false;
        c.cutBy = "top-k";
      }
    });
  }

  if (topPEnabled) {
    let cumulative = 0;
    for (const c of scored) {
      if (!c.survives) continue;
      if (cumulative >= topP) {
        c.survives = false;
        c.cutBy = "top-p";
      } else {
        cumulative += c.prob;
      }
    }
  }

  return scored;
}

function renormalize(scored: ScoredCandidate[]): ScoredCandidate[] {
  const survivorSum = scored.filter((c) => c.survives).reduce((a, c) => a + c.prob, 0);
  return scored.map((c) => (c.survives ? { ...c, prob: c.prob / survivorSum } : c));
}

function sampleFrom(scored: ScoredCandidate[]): string {
  const survivors = scored.filter((c) => c.survives);
  const r = Math.random();
  let cumulative = 0;
  for (const c of survivors) {
    cumulative += c.prob;
    if (r <= cumulative) return c.token;
  }
  return survivors[survivors.length - 1]?.token ?? scored[0].token;
}

export function SamplingPlayground() {
  const [presetId, setPresetId] = useState("peaked");
  const [temperature, setTemperature] = useState(1.0);
  const [topKEnabled, setTopKEnabled] = useState(true);
  const [topK, setTopK] = useState(5);
  const [topPEnabled, setTopPEnabled] = useState(true);
  const [topP, setTopP] = useState(0.9);
  const [sampled, setSampled] = useState<string | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId)!;

  const scored = useMemo(() => {
    const tempered = applyTemperature(preset.candidates, temperature);
    const cut = applyCutoffs(tempered, topKEnabled, topK, topPEnabled, topP);
    return renormalize(cut);
  }, [preset, temperature, topKEnabled, topK, topPEnabled, topP]);

  const survivorCount = scored.filter((c) => c.survives).length;

  const handlePresetChange = (id: string) => {
    setPresetId(id);
    setSampled(null);
  };

  const handleSample = () => {
    setSampled(sampleFrom(scored));
  };

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Sampling playground</span>
        <span className="text-[9px] text-brand-text-subtle">illustrative, not a live model</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetChange(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                p.id === presetId
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTopKEnabled(!topKEnabled)}
                className={`text-[11px] cursor-pointer transition-all duration-500 outline-none ${
                  topKEnabled ? "text-brand-text font-semibold" : "text-brand-text-subtle"
                }`}
              >
                Top-k {topKEnabled ? "on" : "off"}
              </button>
              <span className="text-[11px] font-mono font-semibold text-brand-text">{topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={topK}
              disabled={!topKEnabled}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface disabled:opacity-30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTopPEnabled(!topPEnabled)}
                className={`text-[11px] cursor-pointer transition-all duration-500 outline-none ${
                  topPEnabled ? "text-brand-text font-semibold" : "text-brand-text-subtle"
                }`}
              >
                Top-p {topPEnabled ? "on" : "off"}
              </button>
              <span className="text-[11px] font-mono font-semibold text-brand-text">{topP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={topP}
              disabled={!topPEnabled}
              onChange={(e) => setTopP(Number(e.target.value))}
              className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface disabled:opacity-30"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          {scored.map((c, i) => (
            <div key={c.token} className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono w-20 shrink-0 truncate ${
                  c.survives ? "text-brand-text-muted" : "text-brand-text-subtle line-through"
                }`}
              >
                {c.token}
              </span>
              <div className="flex-1 h-4 rounded bg-brand-surface overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{
                    backgroundColor: c.survives ? BAR_COLORS[i % BAR_COLORS.length] : "var(--brand-border)",
                  }}
                  animate={{ width: `${c.prob * 100}%` }}
                  transition={SPRING}
                />
              </div>
              <span className="text-[10px] font-mono text-brand-text-muted w-14 text-right shrink-0">
                {c.survives ? `${(c.prob * 100).toFixed(1)}%` : c.cutBy}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-brand-text-subtle">
          Grey, struck-through tokens were cut by top-k or top-p. Colored bars are the surviving
          tokens, renormalized so their probabilities sum to 1 again.
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
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
            <span className="text-[10px] text-brand-text-subtle">
              {survivorCount} of {scored.length} tokens survive
            </span>
          </div>
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
                {preset.text} <span className="text-brand-primary font-semibold">{sampled}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
