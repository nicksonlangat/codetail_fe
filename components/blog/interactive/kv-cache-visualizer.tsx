"use client";

import { useMemo, useState } from "react";

// Model assumptions for the memory estimate, held constant so the slider
// only moves one variable: sequence length. Roughly a 7B-parameter-class
// model shape (32 layers, 32 heads, 128-dim heads = 4096 hidden), fp16.
const LAYERS = 32;
const HEADS = 32;
const HEAD_DIM = 128;
const BYTES_PER_ELEMENT = 2; // fp16
const BYTES_PER_TOKEN = 2 * LAYERS * HEADS * HEAD_DIM * BYTES_PER_ELEMENT; // key + value

const N_MIN = 128;
const N_MAX = 32768;
const LOG_RANGE = Math.log(N_MAX / N_MIN);

function nFromSlider(t: number): number {
  return Math.round(N_MIN * Math.exp(t * LOG_RANGE));
}

function sliderFromN(n: number): number {
  return Math.log(n / N_MIN) / LOG_RANGE;
}

function formatTokens(n: number): string {
  if (n >= 1024) return `${(n / 1024).toFixed(n % 1024 === 0 ? 0 : 1)}K`;
  return `${n}`;
}

function formatComparisons(n: number): string {
  const total = n * n;
  if (total >= 1_000_000_000) return `${(total / 1_000_000_000).toFixed(2)}B`;
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(2)}M`;
  return total.toLocaleString();
}

function formatMemory(n: number): string {
  const bytes = n * BYTES_PER_TOKEN;
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(gb >= 10 ? 1 : 2)} GB`;
  const mb = bytes / 1024 ** 2;
  return `${mb.toFixed(1)} MB`;
}

const TICKS = [128, 1024, 4096, 16384, 32768];

export function KVCacheVisualizer() {
  const [t, setT] = useState(sliderFromN(4096));
  const n = nFromSlider(t);

  const { computePct, memoryPct, comparisons, memory, computeRatio, memoryRatio } = useMemo(() => {
    const baseline = 1024;
    // Bar height uses a shared log-scale of "how many doublings past N_MIN,"
    // normalized against compute's own doubling count (2x per doubling of n,
    // vs. memory's 1x per doubling). That shared scale is why the memory bar
    // is mechanically always exactly half the compute bar's height: the
    // exponents are 2 and 1, this is that gap made visible, not a real unit.
    const doublings = Math.log2(n / N_MIN);
    const maxDoublings = Math.log2(N_MAX / N_MIN);
    return {
      computePct: maxDoublings === 0 ? 0 : (doublings / maxDoublings) * 100,
      memoryPct: maxDoublings === 0 ? 0 : (doublings / maxDoublings) * 50,
      comparisons: formatComparisons(n),
      memory: formatMemory(n),
      computeRatio: (n / baseline) ** 2,
      memoryRatio: n / baseline,
    };
  }, [n]);

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Attention compute vs. KV cache memory</span>
        <span className="text-[11px] font-mono text-brand-text-muted">{formatTokens(n)} tokens</span>
      </div>

      <div className="p-4 space-y-5">
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
            aria-label="Sequence length"
          />
          <div className="flex justify-between">
            {TICKS.map((tick) => (
              <span key={tick} className="text-[10px] font-mono text-brand-text-subtle">
                {formatTokens(tick)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-wider text-brand-text-subtle">Attention compute</span>
              <span className="text-[10px] font-mono text-brand-chart-4">n&sup2;</span>
            </div>
            <div className="h-32 flex items-end bg-brand-surface/40 rounded-lg overflow-hidden">
              <div
                className="w-full bg-brand-chart-4 transition-all duration-500"
                style={{ height: `${Math.max(computePct, 2)}%` }}
              />
            </div>
            <p className="text-[12px] font-mono text-brand-text">{comparisons}</p>
            <p className="text-[10px] text-brand-text-subtle">pairwise comparisons, per head per layer</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-wider text-brand-text-subtle">KV cache memory</span>
              <span className="text-[10px] font-mono text-brand-chart-1">n</span>
            </div>
            <div className="h-32 flex items-end bg-brand-surface/40 rounded-lg overflow-hidden">
              <div
                className="w-full bg-brand-chart-1 transition-all duration-500"
                style={{ height: `${Math.max(memoryPct, 2)}%` }}
              />
            </div>
            <p className="text-[12px] font-mono text-brand-text">{memory}</p>
            <p className="text-[10px] text-brand-text-subtle">for this conversation, this model config</p>
          </div>
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted">
          relative to a 1,024 token baseline: attention compute is{" "}
          <span className="text-brand-text font-semibold">{computeRatio.toFixed(1)}&times;</span>, KV cache
          memory is <span className="text-brand-text font-semibold">{memoryRatio.toFixed(1)}&times;</span>
        </div>

        <p className="text-[10px] text-brand-text-subtle">
          Memory assumes a 7B-class model: 32 layers, 32 attention heads, 128-dim head size, fp16 weights.
          Bar heights plot growth shape on a shared log scale, not the raw comparisons-vs-bytes units,
          which is why the compute bar is always exactly twice the memory bar&apos;s height: n&sup2; grows
          twice as fast as n on a log scale. The numbers above each bar are the real, unnormalized values.
        </p>
      </div>
    </div>
  );
}
