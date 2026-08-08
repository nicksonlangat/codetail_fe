"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const W_MIN = -3.5;
const W_MAX = 5.5;
const SAMPLE_COUNT = 140;
const MAX_WEIGHT = 50;
const VBOX_W = 100;
const VBOX_H = 60;
const INITIAL_WEIGHT = -2.6;

function loss(w: number): number {
  return 0.6 * (w - 1) ** 2 + 0.5 * Math.sin(w * 1.3);
}

function gradient(w: number): number {
  return 1.2 * (w - 1) + 0.65 * Math.cos(w * 1.3);
}

function clampWeight(w: number): number {
  return Math.max(-MAX_WEIGHT, Math.min(MAX_WEIGHT, w));
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "inf";
  const abs = Math.abs(n);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return n.toExponential(2);
  return n.toFixed(2);
}

export function LossLandscape() {
  const [weight, setWeight] = useState(INITIAL_WEIGHT);
  const [learningRate, setLearningRate] = useState(0.15);
  const [trail, setTrail] = useState<number[]>([]);

  const samples = useMemo(() => {
    const points: { w: number; l: number }[] = [];
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const w = W_MIN + ((W_MAX - W_MIN) * i) / SAMPLE_COUNT;
      points.push({ w, l: loss(w) });
    }
    return points;
  }, []);

  const { loBound, hiBound, argMinW } = useMemo(() => {
    const ls = samples.map((p) => p.l);
    const minL = Math.min(...ls);
    const maxL = Math.max(...ls);
    const pad = (maxL - minL) * 0.08;
    const best = samples.reduce((b, p) => (p.l < b.l ? p : b), samples[0]);
    return { loBound: minL - pad, hiBound: maxL + pad, argMinW: best.w };
  }, [samples]);

  function toX(w: number): number {
    return ((w - W_MIN) / (W_MAX - W_MIN)) * VBOX_W;
  }

  function toY(l: number): number {
    const y = VBOX_H - ((l - loBound) / (hiBound - loBound)) * VBOX_H;
    return Math.max(0, Math.min(VBOX_H, y));
  }

  const curvePath = useMemo(
    () => `M ${samples.map((p) => `${toX(p.w)},${toY(p.l)}`).join(" L ")}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [samples, loBound, hiBound]
  );

  const currentLoss = loss(weight);
  const currentGrad = gradient(weight);
  const isOffChart = weight < W_MIN || weight > W_MAX;
  const dotW = Math.max(W_MIN, Math.min(W_MAX, weight));
  const nextWeight = clampWeight(weight - learningRate * currentGrad);

  function handleStep() {
    setTrail((prev) => [...prev.slice(-6), weight]);
    setWeight(nextWeight);
  }

  function handleReset() {
    setWeight(INITIAL_WEIGHT);
    setTrail([]);
  }

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">Gradient descent on a loss curve</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-brand-text-muted">current weight</span>
            <span className="text-[10px] font-mono text-brand-text">{weight.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={W_MIN}
            max={W_MAX}
            step={0.05}
            value={dotW}
            onChange={(e) => {
              setWeight(Number(e.target.value));
              setTrail([]);
            }}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-brand-text-muted">learning rate</span>
            <span className="text-[10px] font-mono text-brand-text">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={2.2}
            step={0.02}
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-chart-2 bg-brand-surface"
          />
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={handleStep}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none bg-brand-primary text-white"
          >
            Step downhill
          </motion.button>
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none bg-brand-surface text-brand-text-muted hover:text-brand-text"
          >
            Reset
          </motion.button>
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted space-y-1">
          <div>
            loss(w) = <span className="text-brand-text font-semibold">{formatNum(currentLoss)}</span>
          </div>
          <div>
            gradient = <span className="text-brand-text font-semibold">{formatNum(currentGrad)}</span>
          </div>
          <div>
            w_new = w - (lr &times; gradient) = {weight.toFixed(2)} - ({learningRate.toFixed(2)} &times;{" "}
            {formatNum(currentGrad)}) = <span className="text-brand-text font-semibold">{formatNum(nextWeight)}</span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${VBOX_W} ${VBOX_H}`}
          className="w-full aspect-[5/3] bg-brand-surface/40 rounded-lg overflow-visible"
        >
          <line
            x1={toX(argMinW)}
            y1={0}
            x2={toX(argMinW)}
            y2={VBOX_H}
            stroke="var(--brand-border)"
            strokeWidth={0.4}
            strokeDasharray="2,2"
          />
          <path d={curvePath} fill="none" stroke="var(--brand-chart-1)" strokeWidth={0.8} />
          {trail.map((w, i) => (
            <circle
              key={i}
              cx={toX(Math.max(W_MIN, Math.min(W_MAX, w)))}
              cy={toY(loss(Math.max(W_MIN, Math.min(W_MAX, w))))}
              r={1.1}
              fill="var(--brand-chart-2)"
              opacity={0.15 + (0.5 * (i + 1)) / (trail.length + 1)}
            />
          ))}
          <circle
            cx={toX(dotW)}
            cy={toY(currentLoss)}
            r={1.8}
            fill={isOffChart ? "var(--brand-destructive)" : "var(--brand-primary)"}
          />
        </svg>

        <p className="text-[10px] text-brand-text-subtle text-center">
          {isOffChart
            ? "Off the chart. The learning rate is too high and the weight is diverging, not converging."
            : "x-axis: weight value. y-axis: loss. Dashed line marks the true minimum. Click Step to move downhill by gradient times learning rate."}
        </p>
      </div>
    </div>
  );
}
