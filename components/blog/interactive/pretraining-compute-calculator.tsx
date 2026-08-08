"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const BAR_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

// Effective FLOPs/sec per GPU. Real training runs never hit a GPU's advertised
// peak, kernel launches, communication between GPUs, and data loading all eat
// into it. ~400 TFLOPS is a reasonable stand-in for one H100 at roughly 40%
// model FLOPs utilization, a healthy number for a well-tuned run.
const FLOPS_PER_GPU = 4e14;
const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;

const GPU_PRESETS = [64, 512, 2048, 8192, 16384];

const MODEL_PRESETS = [
  { id: "small", label: "350M", paramsExp: Math.log10(350e6), tokensExp: Math.log10(300e9) },
  { id: "mid", label: "7B", paramsExp: Math.log10(7e9), tokensExp: Math.log10(2e12) },
  { id: "large", label: "70B", paramsExp: Math.log10(70e9), tokensExp: Math.log10(15e12) },
];

const PARAMS_MIN = Math.log10(100e6);
const PARAMS_MAX = Math.log10(70e9);
const TOKENS_MIN = Math.log10(100e9);
const TOKENS_MAX = Math.log10(15e12);

function formatParams(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 10e9 ? 0 : 1)}B`;
  return `${(n / 1e6).toFixed(0)}M`;
}

function formatTokens(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  return `${(n / 1e9).toFixed(0)}B`;
}

function formatFlops(n: number): string {
  const exponent = Math.floor(Math.log10(n));
  const mantissa = n / Math.pow(10, exponent);
  return `${mantissa.toFixed(2)} × 10${toSuperscript(exponent)}`;
}

function toSuperscript(n: number): string {
  const map: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
  };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

function formatDuration(months: number): string {
  if (months < 1 / 30) return `${Math.max(1, Math.round(months * SECONDS_PER_MONTH / 3600))} hours`;
  if (months < 1) return `${(months * 30).toFixed(1)} days`;
  if (months < 24) return `${months.toFixed(1)} months`;
  return `${(months / 12).toFixed(1)} years`;
}

export function PretrainingComputeCalculator() {
  const [paramsExp, setParamsExp] = useState(MODEL_PRESETS[1].paramsExp);
  const [tokensExp, setTokensExp] = useState(MODEL_PRESETS[1].tokensExp);
  const [gpuCount, setGpuCount] = useState(2048);

  const params = Math.pow(10, paramsExp);
  const tokens = Math.pow(10, tokensExp);

  const totalFlops = 6 * params * tokens;
  const gpuSecondsTotal = totalFlops / FLOPS_PER_GPU;
  const gpuMonths = gpuSecondsTotal / SECONDS_PER_MONTH;
  const wallClockMonths = gpuMonths / gpuCount;

  const barWidth = useMemo(() => {
    const maxMonths = 24;
    return `${Math.min(100, (wallClockMonths / maxMonths) * 100)}%`;
  }, [wallClockMonths]);

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Pretraining compute calculator</span>
        <span className="text-[9px] text-brand-text-subtle">FLOPs ≈ 6 × params × tokens</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {MODEL_PRESETS.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              onClick={() => {
                setParamsExp(p.paramsExp);
                setTokensExp(p.tokensExp);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                Math.abs(paramsExp - p.paramsExp) < 0.01 && Math.abs(tokensExp - p.tokensExp) < 0.01
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              ~{p.label} model
            </motion.button>
          ))}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[11px] text-brand-text-muted">Model parameters</span>
            <span className="text-[11px] font-mono font-semibold text-brand-text">{formatParams(params)}</span>
          </div>
          <input
            type="range"
            min={PARAMS_MIN}
            max={PARAMS_MAX}
            step={0.01}
            value={paramsExp}
            onChange={(e) => setParamsExp(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
          />
          <div className="flex justify-between">
            <span className="text-[9px] text-brand-text-subtle">100M</span>
            <span className="text-[9px] text-brand-text-subtle">70B</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[11px] text-brand-text-muted">Total training tokens</span>
            <span className="text-[11px] font-mono font-semibold text-brand-text">{formatTokens(tokens)}</span>
          </div>
          <input
            type="range"
            min={TOKENS_MIN}
            max={TOKENS_MAX}
            step={0.01}
            value={tokensExp}
            onChange={(e) => setTokensExp(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-chart-2 bg-brand-surface"
          />
          <div className="flex justify-between">
            <span className="text-[9px] text-brand-text-subtle">100B</span>
            <span className="text-[9px] text-brand-text-subtle">15T</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] text-brand-text-muted">GPUs available (for wall-clock time)</span>
          <div className="flex flex-wrap gap-1.5">
            {GPU_PRESETS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGpuCount(g)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                  g === gpuCount
                    ? "bg-brand-primary text-white"
                    : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
                }`}
              >
                {g.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted space-y-1.5">
          <div>
            total FLOPs = 6 &times; {formatParams(params)} &times; {formatTokens(tokens)} ={" "}
            <span className="text-brand-text font-semibold">{formatFlops(totalFlops)} FLOPs</span>
          </div>
          <div>
            single-GPU equivalent ={" "}
            <span className="text-brand-text font-semibold">{gpuMonths.toLocaleString(undefined, { maximumFractionDigits: 0 })} GPU-months</span>
          </div>
          <div>
            at {gpuCount.toLocaleString()} GPUs, wall-clock ≈{" "}
            <span className="text-brand-text font-semibold">{formatDuration(wallClockMonths)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-4 rounded bg-brand-surface overflow-hidden">
            <motion.div
              className="h-full rounded bg-brand-chart-1"
              animate={{ width: barWidth }}
              transition={BAR_SPRING}
            />
          </div>
          <p className="text-[9px] text-brand-text-subtle text-center">
            wall-clock training time, scaled against a 24-month bar
          </p>
        </div>

        <p className="text-[10px] text-brand-text-subtle">
          Assumes ~400 TFLOPS/sec effective per GPU, roughly 40% of one H100&apos;s peak bf16
          throughput, a realistic model FLOPs utilization for a well-tuned run. Real numbers vary
          with interconnect, precision, and framework overhead.
        </p>
      </div>
    </div>
  );
}
