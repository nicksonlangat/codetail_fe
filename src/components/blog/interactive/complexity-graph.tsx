"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "framer-motion";

export type ComplexityLine = {
  label: string;
  color: string;
  fn: (n: number) => number;
  description: string;
};

type ComplexityGraphProps = {
  lines?: ComplexityLine[];
  nMax?: number;
  title?: string;
};

const W = 400;
const H = 160;
const PAD = 36;

function toPoints(fn: (n: number) => number, nMax: number, maxY: number): string {
  return Array.from({ length: 101 }, (_, i) => {
    const n = (i / 100) * nMax;
    const val = fn(n);
    const x = PAD + (i / 100) * (W - PAD * 2);
    const y = H - PAD - (Math.min(val, maxY) / maxY) * (H - PAD * 2);
    return `${x.toFixed(1)},${Math.max(PAD, y).toFixed(1)}`;
  }).join(" ");
}

const defaultLines: ComplexityLine[] = [
  {
    label: "str += (loop)",
    color: "#f97316",
    fn: (n) => n * n,
    description: "O(n²) — copies the entire string on every iteration",
  },
  {
    label: '"".join()',
    color: "#1fad87",
    fn: (n) => n,
    description: "O(n) — builds the string once at the end",
  },
];

export function ComplexityGraph({
  lines = defaultLines,
  nMax = 100,
  title = "Performance comparison",
}: ComplexityGraphProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "-");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const maxY = Math.max(...lines.map((l) => l.fn(nMax)));
  const gridYs = Array.from({ length: 5 }, (_, i) => PAD + (i / 4) * (H - PAD * 2));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-4">
        {title}
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id={`clip-${id}`}>
            <motion.rect
              x={PAD}
              y={0}
              height={H}
              initial={{ width: 0 }}
              animate={{ width: inView ? W - PAD : 0 }}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
            />
          </clipPath>
        </defs>

        {/* Horizontal grid lines */}
        {gridYs.map((y, i) => (
          <line
            key={i}
            x1={PAD}
            y1={y}
            x2={W - PAD / 2}
            y2={y}
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-border"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y axis */}
        <line
          x1={PAD}
          y1={PAD * 0.5}
          x2={PAD}
          y2={H - PAD}
          stroke="currentColor"
          strokeWidth={1}
          className="text-border"
        />
        {/* X axis */}
        <line
          x1={PAD}
          y1={H - PAD}
          x2={W - PAD * 0.5}
          y2={H - PAD}
          stroke="currentColor"
          strokeWidth={1}
          className="text-border"
        />

        {/* Axis labels */}
        <text
          x={W / 2}
          y={H - 6}
          textAnchor="middle"
          fontSize={9}
          fill="currentColor"
          className="text-muted-foreground"
        >
          n (input size →)
        </text>
        <text
          x={10}
          y={H / 2}
          textAnchor="middle"
          fontSize={9}
          fill="currentColor"
          className="text-muted-foreground"
          transform={`rotate(-90, 10, ${H / 2})`}
        >
          operations
        </text>

        {/* Data lines — animated reveal */}
        <g clipPath={`url(#clip-${id})`}>
          {lines.map((line) => (
            <polyline
              key={line.label}
              points={toPoints(line.fn, nMax, maxY)}
              fill="none"
              stroke={line.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mt-3">
        {lines.map((line) => (
          <div key={line.label} className="flex items-start gap-2">
            <div
              className="w-3 h-0.5 mt-[7px] flex-shrink-0 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <div>
              <span
                className="text-[11px] font-mono font-medium block"
                style={{ color: line.color }}
              >
                {line.label}
              </span>
              <p className="text-[11px] text-muted-foreground">{line.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
