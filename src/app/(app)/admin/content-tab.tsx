"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Cpu, CheckCircle2, XCircle } from "lucide-react";
import { getContentStats } from "@/lib/api/admin";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function DistributionBar({ data, colors }: { data: Record<string, number>; colors: Record<string, string> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex rounded-full overflow-hidden h-2 bg-muted/30">
        {Object.entries(data).map(([key, count]) => (
          <motion.div
            key={key}
            className={colors[key] || "bg-muted"}
            initial={{ width: 0 }}
            animate={{ width: `${(count / total) * 100}%` }}
            transition={{ ...spring, delay: 0.2 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.entries(data).map(([key, count]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${colors[key] || "bg-muted"}`} />
            <span className="text-[10px] text-muted-foreground">
              {key} <span className="font-mono font-medium text-foreground">{count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500",
  medium: "bg-orange-500",
  hard: "bg-red-500",
};

const stackColors: Record<string, string> = {
  python: "bg-blue-500",
  django: "bg-emerald-500",
  fastapi: "bg-teal-500",
  sql: "bg-purple-500",
  go: "bg-cyan-500",
};

const typeColors: Record<string, string> = {
  write_code: "bg-primary",
  mcq: "bg-amber-500",
  fix_code: "bg-rose-500",
  refactor: "bg-violet-500",
};

export function ContentTab() {
  const { data: stats } = useQuery({
    queryKey: ["admin-content"],
    queryFn: getContentStats,
  });

  if (!stats) return <div className="text-[12px] text-muted-foreground py-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Paths", value: stats.total_paths, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Problems", value: stats.total_problems, icon: Cpu, color: "text-primary", bg: "bg-primary/10" },
          { label: "Hand-crafted", value: stats.hand_crafted_problems, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "AI Generated", value: stats.generated_problems, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</span>
            <div className="text-xl font-bold font-mono tabular-nums mt-1">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-[11px] font-semibold mb-3">By Difficulty</h3>
          <DistributionBar data={stats.by_difficulty} colors={difficultyColors} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-[11px] font-semibold mb-3">By Stack</h3>
          <DistributionBar data={stats.by_stack} colors={stackColors} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-[11px] font-semibold mb-3">By Type</h3>
          <DistributionBar data={stats.by_type} colors={typeColors} />
        </motion.div>
      </div>

      {/* Paths table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[13px] font-semibold">Learning Paths</h2>
        </div>

        <div className="grid grid-cols-[1fr_100px_100px_80px_60px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
          <span>Title</span>
          <span>Stack</span>
          <span>Difficulty</span>
          <span>Problems</span>
          <span>Active</span>
        </div>

        {stats.paths.map((path, i) => (
          <motion.div key={path.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="grid grid-cols-[1fr_100px_100px_80px_60px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
          >
            <span className="font-medium truncate text-foreground">{path.title}</span>
            <span className="text-[10px] font-semibold text-primary">{path.stack}</span>
            <span className={`text-[10px] font-medium ${
              path.difficulty === "beginner" ? "text-green-500" : path.difficulty === "intermediate" ? "text-orange-500" : "text-red-500"
            }`}>
              {path.difficulty}
            </span>
            <span className="font-mono tabular-nums">{path.problem_count}</span>
            <span>
              {path.is_active ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-muted-foreground/30" />}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
