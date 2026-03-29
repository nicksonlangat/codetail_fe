"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getActivityStats } from "@/lib/api/admin";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function MiniChart({ data, color = "bg-primary/60", hoverColor = "bg-primary" }: { data: { date: string; count: number }[]; color?: string; hoverColor?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex items-end gap-[3px] h-20">
        {data.map((d, i) => {
          const h = (d.count / max) * 100;
          return (
            <motion.div key={d.date}
              className={`flex-1 ${color} hover:${hoverColor} rounded-t-sm cursor-pointer transition-colors duration-300`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(h, 2)}%` }}
              transition={{ delay: 0.2 + i * 0.015, type: "spring", stiffness: 300, damping: 20 }}
              title={`${d.date}: ${d.count}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-muted-foreground/40 font-mono">{data[0]?.date.slice(5)}</span>
        <span className="text-[9px] text-muted-foreground/40 font-mono">{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

export function ActivityTab() {
  const { data: stats } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: getActivityStats,
  });

  if (!stats) return <div className="text-[12px] text-muted-foreground py-8 text-center">Loading...</div>;

  const aiTotal = stats.total_ai_reviews + stats.total_hints + stats.total_solutions;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Attempts", value: stats.total_attempts },
          { label: "Problems Solved", value: stats.total_solved },
          { label: "Avg Score", value: `${stats.avg_score}%` },
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

      {/* AI Usage cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "AI Total", value: aiTotal, color: "text-primary" },
          { label: "Reviews", value: stats.total_ai_reviews, color: "text-blue-500" },
          { label: "Hints", value: stats.total_hints, color: "text-amber-500" },
          { label: "Solutions", value: stats.total_solutions, color: "text-purple-500" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</span>
            <div className={`text-xl font-bold font-mono tabular-nums mt-1 ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-[12px] font-semibold mb-3">Problems Solved — Last 30 days</h2>
          <MiniChart data={stats.solved_per_day} color="bg-green-500/60" hoverColor="bg-green-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-[12px] font-semibold mb-3">AI Usage — Last 30 days</h2>
          <MiniChart
            data={stats.ai_usage_per_day.map((d) => ({ date: d.date, count: d.reviews + d.hints + d.solutions }))}
            color="bg-blue-500/60"
            hoverColor="bg-blue-500"
          />
        </motion.div>
      </div>

      {/* AI usage breakdown table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }}
        className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[13px] font-semibold">AI Usage — Daily Breakdown (last 7 days)</h2>
        </div>

        <div className="grid grid-cols-[1fr_80px_80px_80px_80px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
          <span>Date</span>
          <span>Reviews</span>
          <span>Hints</span>
          <span>Solutions</span>
          <span>Total</span>
        </div>

        {stats.ai_usage_per_day.slice(-7).reverse().map((d, i) => (
          <motion.div key={d.date}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="grid grid-cols-[1fr_80px_80px_80px_80px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
          >
            <span className="font-mono tabular-nums text-muted-foreground">{d.date}</span>
            <span className="font-mono tabular-nums text-blue-500">{d.reviews}</span>
            <span className="font-mono tabular-nums text-amber-500">{d.hints}</span>
            <span className="font-mono tabular-nums text-purple-500">{d.solutions}</span>
            <span className="font-mono tabular-nums font-medium">{d.reviews + d.hints + d.solutions}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
