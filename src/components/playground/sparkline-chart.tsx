"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

function generateData(base: number, variance: number, count = 20) {
  const points: number[] = [];
  let v = base;
  for (let i = 0; i < count; i++) {
    v += (Math.random() - 0.45) * variance;
    v = Math.max(base - variance * 2, Math.min(base + variance * 2, v));
    points.push(Math.round(v * 10) / 10);
  }
  return points;
}

const metrics = [
  { label: "Problems Solved", value: 247, unit: "", data: generateData(200, 15), trend: "up" as const },
  { label: "Accuracy", value: 84.3, unit: "%", data: generateData(82, 4), trend: "up" as const },
  { label: "Avg Time", value: 12.4, unit: "min", data: generateData(14, 2), trend: "down" as const },
];

const SVG_W = 180;
const SVG_H = 48;
const PAD = 2;

function Sparkline({
  data,
  trendDir,
}: {
  data: number[];
  trendDir: "up" | "down";
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = useMemo(
    () =>
      data.map((v, i) => ({
        x: PAD + (i / (data.length - 1)) * (SVG_W - PAD * 2),
        y: PAD + (1 - (v - min) / range) * (SVG_H - PAD * 2),
        value: v,
      })),
    [data, min, range]
  );

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const gradientPath = `M${points[0].x},${SVG_H} ${points.map((p) => `L${p.x},${p.y}`).join(" ")} L${points[points.length - 1].x},${SVG_H} Z`;

  const gradientId = useMemo(() => `spark-grad-${Math.random().toString(36).slice(2, 8)}`, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * SVG_W;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < points.length; i++) {
        const d = Math.abs(points[i].x - x);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      }
      setHoverIdx(closest);
    },
    [points]
  );

  const hp = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full h-12 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(164 70% 40%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(164 70% 40%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={gradientPath} fill={`url(#${gradientId})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke="hsl(164 70% 40%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hp && (
        <>
          <line
            x1={hp.x}
            y1={0}
            x2={hp.x}
            y2={SVG_H}
            stroke="hsl(164 70% 40%)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.5"
          />
          <circle cx={hp.x} cy={hp.y} r="3" fill="hsl(164 70% 40%)" />
          <rect
            x={Math.min(hp.x + 4, SVG_W - 36)}
            y={Math.max(hp.y - 18, 0)}
            width="32"
            height="16"
            rx="3"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          <text
            x={Math.min(hp.x + 20, SVG_W - 20)}
            y={Math.max(hp.y - 7, 13)}
            textAnchor="middle"
            fontSize="8"
            fill="hsl(var(--foreground))"
            fontFamily="monospace"
          >
            {hp.value}
          </text>
        </>
      )}
    </svg>
  );
}

export function SparklineChart() {
  return (
    <div className="py-6 grid grid-cols-3 gap-4">
      {metrics.map((m) => {
        const TrendIcon = m.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor =
          (m.trend === "up" && m.label !== "Avg Time") ||
          (m.trend === "down" && m.label === "Avg Time")
            ? "text-green-500"
            : "text-red-500";

        return (
          <motion.div
            key={m.label}
            className="bg-card rounded-xl border border-border/50 p-4 cursor-pointer"
            whileHover={{ y: -2 }}
            transition={spring}
          >
            <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-xl font-bold font-mono tabular-nums text-foreground">
                {m.value}
              </span>
              {m.unit && (
                <span className="text-xs text-muted-foreground">{m.unit}</span>
              )}
              <TrendIcon className={`w-3.5 h-3.5 ml-auto ${trendColor}`} />
            </div>
            <Sparkline data={m.data} trendDir={m.trend} />
          </motion.div>
        );
      })}
    </div>
  );
}
