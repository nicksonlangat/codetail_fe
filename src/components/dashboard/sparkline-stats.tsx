"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Code2, Database, Layout, ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getStats, type DayPoint } from "@/lib/api/progress";
import { useAuthStore } from "@/stores/auth-store";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const entranceSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

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

/* ── Starter paths for the welcome state ── */
const starterPaths = [
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    description: "Functions, data structures, idiomatic patterns",
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    slug: "django-models",
    title: "Django Models",
    description: "Fields, relationships, managers, queries",
    icon: Database,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    slug: "django-fundamentals",
    title: "Django Fundamentals",
    description: "Views, URLs, templates, forms, middleware",
    icon: Layout,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

/* ── Welcome state for new users ── */
function WelcomeState() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || "there";
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={entranceSpring}
      className="py-2"
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...entranceSpring, delay: 0.1 }}
            className="flex items-center gap-3 mb-3"
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Welcome, {firstName}</h2>
              <p className="text-[12px] text-muted-foreground">Pick a path and solve your first challenge — takes 5 minutes.</p>
            </div>
          </motion.div>
        </div>

        {/* Path cards */}
        <div className="px-6 pb-6 grid grid-cols-3 gap-3">
          {starterPaths.map((path, i) => {
            const Icon = path.icon;
            const isHovered = hoveredPath === path.slug;
            return (
              <Link key={path.slug} href={`/paths/${path.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...entranceSpring, delay: 0.2 + i * 0.08 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredPath(path.slug)}
                  onHoverEnd={() => setHoveredPath(null)}
                  className="relative rounded-lg border border-border/60 p-4 cursor-pointer transition-colors duration-500 hover:border-primary/30 overflow-hidden"
                >
                  {/* Subtle glow on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-primary/[0.03]"
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <div className={`w-8 h-8 rounded-lg ${path.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-4 h-4 ${path.color}`} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-foreground mb-1">{path.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{path.description}</p>

                    <motion.div
                      className="flex items-center gap-1 mt-3 text-[11px] font-medium text-primary"
                      animate={{ x: isHovered ? 2 : 0 }}
                      transition={spring}
                    >
                      Start path
                      <motion.span
                        animate={{ x: isHovered ? 3 : 0 }}
                        transition={spring}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Or generate */}
        <div className="px-6 pb-5 flex items-center gap-2">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        <div className="px-6 pb-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            onClick={() => setGenerateOpen(true)}
            className="flex items-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors duration-100"
          >
            <Sparkles className="w-4 h-4" />
            Generate an AI Challenge
          </motion.button>
        </div>
      </div>

      <GenerateChallengeDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
    </motion.div>
  );
}

/* ── Main component ── */
export function SparklineStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="py-2 grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-4 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  // Welcome state for new users
  if (!stats || stats.total_attempted === 0) {
    return <WelcomeState />;
  }

  const solvedData = stats.solved_per_day.map((d) => d.value);
  const accuracyData = stats.accuracy_per_day.map((d) => d.value);
  const scoreData = stats.score_per_day.map((d) => d.value);

  const metrics = [
    {
      label: "Problems Solved",
      value: stats.total_solved,
      unit: "",
      data: solvedData,
      trend: getTrend(solvedData),
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
    {
      label: "Accuracy",
      value: stats.accuracy,
      unit: "%",
      data: accuracyData,
      trend: getTrend(accuracyData),
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
    {
      label: "Avg Score",
      value: stats.avg_score,
      unit: "",
      data: scoreData,
      trend: getTrend(scoreData),
      trendGood: "up" as const,
      color: "hsl(164 70% 40%)",
    },
  ];

  return (
    <div className="py-2 grid grid-cols-3 gap-4">
      {metrics.map((m, i) => {
        const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : TrendingUp;
        const isGood = m.trend === m.trendGood || m.trend === "flat";
        const trendColor = m.trend === "flat" ? "text-muted-foreground" : isGood ? "text-green-500" : "text-red-500";

        return (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entranceSpring, delay: i * 0.06 }}
            className="bg-card rounded-xl border border-border/50 p-4 cursor-pointer"
            whileHover={{ y: -2 }}
          >
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
