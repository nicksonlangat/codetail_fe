"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStats, type DayPoint } from "@/lib/api/progress";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const SVG_W = 180;
const SVG_H = 48;
const PAD = 2;

function Sparkline({ data, color = "hsl(164 70% 40%)" }: { data: number[]; color?: string }) {
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
        if (d < minDist) { minDist = d; closest = i; }
      }
      setHoverIdx(closest);
    },
    [points]
  );

  const hp = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-12 cursor-pointer"
      onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={gradientPath} fill={`url(#${gradientId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {hp && (
        <>
          <line x1={hp.x} y1={0} x2={hp.x} y2={SVG_H} stroke={color} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
          <circle cx={hp.x} cy={hp.y} r="3" fill={color} />
          <rect x={Math.min(hp.x + 4, SVG_W - 36)} y={Math.max(hp.y - 18, 0)} width="32" height="16" rx="3"
            className="fill-card stroke-border" strokeWidth="0.5" />
          <text x={Math.min(hp.x + 20, SVG_W - 20)} y={Math.max(hp.y - 7, 13)} textAnchor="middle" fontSize="8"
            className="fill-foreground" fontFamily="monospace">{hp.value}</text>
        </>
      )}
    </svg>
  );
}

function getTrend(data: number[]): "up" | "down" | "flat" {
  if (data.length < 2) return "flat";
  const recent = data.slice(-5);
  const earlier = data.slice(-10, -5);
  if (!earlier.length) return "flat";
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  if (recentAvg > earlierAvg * 1.02) return "up";
  if (recentAvg < earlierAvg * 0.98) return "down";
  return "flat";
}

export function SparklineStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
    staleTime: 30000,
  });

  if (isLoading || !stats) {
    return (
      <div className="py-6 grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-4 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  const solvedData = stats.solved_per_day.map((d) => d.value);
  const accuracyData = stats.accuracy_per_day.map((d) => d.value);
  const scoreData = stats.score_per_day.map((d) => d.value);

  const solvedTrend = getTrend(solvedData);
  const accuracyTrend = getTrend(accuracyData);
  const scoreTrend = getTrend(scoreData);

  const metrics = [
    {
      label: "Problems Solved",
      value: stats.total_solved,
      unit: "",
      data: solvedData,
      trend: solvedTrend,
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
    {
      label: "Accuracy",
      value: stats.accuracy,
      unit: "%",
      data: accuracyData,
      trend: accuracyTrend,
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
    {
      label: "Avg Score",
      value: stats.avg_score,
      unit: "",
      data: scoreData,
      trend: scoreTrend,
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
  ];

  return (
    <div className="py-2 grid grid-cols-3 gap-4">
      {metrics.map((m) => {
        const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : TrendingUp;
        const isGood = m.trend === m.trendGood || m.trend === "flat";
        const trendColor = m.trend === "flat" ? "text-muted-foreground" : isGood ? "text-green-500" : "text-red-500";

        return (
          <motion.div key={m.label}
            className="bg-card rounded-xl border border-border/50 p-4 cursor-pointer"
            whileHover={{ y: -2 }}
            transition={spring}>
            <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-xl font-bold font-mono tabular-nums text-foreground">{m.value}</span>
              {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
              {m.trend !== "flat" && <TrendIcon className={`w-3.5 h-3.5 ml-auto ${trendColor}`} />}
            </div>
            <Sparkline data={m.data.length > 1 ? m.data : [0, 0]} color={m.color} />
          </motion.div>
        );
      })}
    </div>
  );
}
