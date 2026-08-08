"use client";

import { useMemo, useState } from "react";

// A pure power law: loss = A * compute^(-alpha). Real scaling laws have a
// small irreducible-entropy floor that bends the curve slightly at extreme
// scale, but across the range labs actually train in, this is what a
// log-log plot of loss against compute looks like: a straight line.
const A = 38;
const ALPHA = 0.056;

const MIN_LOG_C = 18; // 10^18 FLOPs: a small research-scale run
const MAX_LOG_C = 25; // 10^25 FLOPs: frontier-scale training

function lossAt(logC: number): number {
  const logL = Math.log10(A) - ALPHA * logC;
  return Math.pow(10, logL);
}

const MIN_LOG_L = Math.log10(lossAt(MAX_LOG_C)) - 0.04;
const MAX_LOG_L = Math.log10(lossAt(MIN_LOG_C)) + 0.04;

const W = 400;
const H = 220;
const PAD_L = 40;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 30;

function xForLogC(logC: number): number {
  return PAD_L + ((logC - MIN_LOG_C) / (MAX_LOG_C - MIN_LOG_C)) * (W - PAD_L - PAD_R);
}

function yForLoss(loss: number): number {
  const logL = Math.log10(loss);
  return H - PAD_B - ((logL - MIN_LOG_L) / (MAX_LOG_L - MIN_LOG_L)) * (H - PAD_T - PAD_B);
}

function buildCurve(): string {
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const logC = MIN_LOG_C + (i / 100) * (MAX_LOG_C - MIN_LOG_C);
    points.push(`${xForLogC(logC).toFixed(1)},${yForLoss(lossAt(logC)).toFixed(1)}`);
  }
  return points.join(" L ");
}

function formatCompute(logC: number): string {
  const exp = Math.floor(logC);
  const mantissa = Math.pow(10, logC - exp);
  return `${mantissa.toFixed(1)} × 10^${exp} FLOPs`;
}

const TICK_LOGS = [18, 20, 22, 24];

export function ScalingLawCurve() {
  const [logC, setLogC] = useState(21);
  const loss = lossAt(logC);
  const curvePath = useMemo(() => `M ${buildCurve()}`, []);
  const pointX = xForLogC(logC);
  const pointY = yForLoss(loss);

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">
          Predicted loss versus training compute, log-log scale
        </span>
      </div>

      <div className="p-4 space-y-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {TICK_LOGS.map((t) => (
            <line
              key={t}
              x1={xForLogC(t)}
              y1={PAD_T}
              x2={xForLogC(t)}
              y2={H - PAD_B}
              stroke="var(--brand-border)"
              strokeWidth={0.75}
              strokeDasharray="3 3"
            />
          ))}

          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--brand-border)" strokeWidth={1} />
          <line
            x1={PAD_L}
            y1={H - PAD_B}
            x2={W - PAD_R}
            y2={H - PAD_B}
            stroke="var(--brand-border)"
            strokeWidth={1}
          />

          {TICK_LOGS.map((t) => (
            <text
              key={t}
              x={xForLogC(t)}
              y={H - PAD_B + 13}
              textAnchor="middle"
              fontSize={8}
              fill="var(--brand-text-subtle)"
            >
              {`10^${t}`}
            </text>
          ))}

          <text
            x={W / 2}
            y={H - 4}
            textAnchor="middle"
            fontSize={8.5}
            fill="var(--brand-text-muted)"
          >
            training compute (FLOPs, log scale)
          </text>
          <text
            x={12}
            y={H / 2}
            textAnchor="middle"
            fontSize={8.5}
            fill="var(--brand-text-muted)"
            transform={`rotate(-90, 12, ${H / 2})`}
          >
            loss (log scale)
          </text>

          <path d={curvePath} fill="none" stroke="var(--brand-chart-1)" strokeWidth={2.25} strokeLinecap="round" />

          <line
            x1={pointX}
            y1={PAD_T}
            x2={pointX}
            y2={H - PAD_B}
            stroke="var(--brand-primary)"
            strokeWidth={0.75}
            strokeDasharray="2 2"
            opacity={0.5}
          />
          <circle cx={pointX} cy={pointY} r={4.5} fill="var(--brand-primary)" stroke="white" strokeWidth={1.5} />
        </svg>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-mono text-brand-text-muted">training compute budget</span>
            <span className="text-[10px] font-mono text-brand-text">{formatCompute(logC)}</span>
          </div>
          <input
            type="range"
            min={MIN_LOG_C}
            max={MAX_LOG_C}
            step={0.05}
            value={logC}
            onChange={(e) => setLogC(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
          />
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted">
          predicted loss at this compute budget ={" "}
          <span className="text-brand-text font-semibold">{loss.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}
