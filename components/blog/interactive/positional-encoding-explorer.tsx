"use client";

import { useMemo, useState } from "react";

const D_MODEL = 32;
const MAX_POS = 20;

function encodingValue(pos: number, dim: number, dModel: number): number {
  const pairIndex = Math.floor(dim / 2);
  const freq = 1 / Math.pow(10000, (2 * pairIndex) / dModel);
  return dim % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
}

function rowVector(pos: number, dModel: number): number[] {
  return Array.from({ length: dModel }, (_, dim) => encodingValue(pos, dim, dModel));
}

function buildWavePath(values: number[]): string {
  const points = values.map((v, i) => `${i},${-v}`);
  return `M ${points.join(" L ")}`;
}

export function PositionalEncodingExplorer() {
  const [position, setPosition] = useState(3);

  const currentVector = useMemo(() => rowVector(position, D_MODEL), [position]);
  const wavePath = useMemo(() => buildWavePath(currentVector), [currentVector]);

  const heatmapRows = useMemo(
    () => Array.from({ length: MAX_POS + 1 }, (_, pos) => rowVector(pos, D_MODEL)),
    []
  );

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">
          Sinusoidal positional encoding, {D_MODEL} dimensions
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-brand-text-muted">position</span>
            <span className="text-[10px] font-mono text-brand-text">{position}</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_POS}
            step={1}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
          />
        </div>

        <div>
          <p className="text-[10px] text-brand-text-subtle mb-1">
            This position&apos;s fingerprint, one wave value per embedding dimension
          </p>
          <svg
            viewBox={`0 -1.3 ${D_MODEL - 1} 2.6`}
            className="w-full aspect-[3/1] bg-brand-surface/40 rounded-lg"
          >
            <line x1={0} y1={0} x2={D_MODEL - 1} y2={0} stroke="var(--brand-border)" strokeWidth={0.02} />
            <path d={wavePath} fill="none" stroke="var(--brand-chart-1)" strokeWidth={0.05} />
            {currentVector.map((v, i) => (
              <circle key={i} cx={i} cy={-v} r={0.06} fill="var(--brand-primary)" />
            ))}
          </svg>
        </div>

        <div>
          <p className="text-[10px] text-brand-text-subtle mb-1">
            Positions 0 to {MAX_POS} stacked, one row per position, current row outlined
          </p>
          <svg
            viewBox={`0 0 ${D_MODEL} ${MAX_POS + 1}`}
            className="w-full bg-brand-surface/40 rounded-lg"
            style={{ aspectRatio: `${D_MODEL} / ${MAX_POS + 1}` }}
            preserveAspectRatio="none"
          >
            {heatmapRows.map((row, pos) =>
              row.map((v, dim) => (
                <rect
                  key={`${pos}-${dim}`}
                  x={dim}
                  y={pos}
                  width={1}
                  height={1}
                  fill={v >= 0 ? "var(--brand-primary)" : "var(--brand-chart-3)"}
                  fillOpacity={0.15 + 0.75 * Math.abs(v)}
                />
              ))
            )}
            <rect
              x={0}
              y={position}
              width={D_MODEL}
              height={1}
              fill="none"
              stroke="var(--brand-warning)"
              strokeWidth={0.12}
            />
          </svg>
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted">
          PE(pos={position}) = [{currentVector.slice(0, 6).map((v) => v.toFixed(2)).join(", ")}, ...]
        </div>
        <p className="text-[10px] text-brand-text-subtle text-center">
          Top: the wave pattern for one position, low dimensions oscillate fast, high dimensions
          oscillate slow. Bottom: every position from 0 to {MAX_POS} at once, no two rows match.
        </p>
      </div>
    </div>
  );
}
