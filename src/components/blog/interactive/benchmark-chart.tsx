"use client";

import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export type BenchmarkDataPoint = {
  label: string;
  p50: number;
  p95: number;
  p99: number;
};

type BenchmarkChartProps = {
  title: string;
  unit?: string;
  before: BenchmarkDataPoint;
  after: BenchmarkDataPoint;
  note?: string;
};

const METRICS: Array<{ key: keyof Omit<BenchmarkDataPoint, "label">; label: string }> = [
  { key: "p50", label: "p50 (median)" },
  { key: "p95", label: "p95" },
  { key: "p99", label: "p99" },
];

export function BenchmarkChart({ title, unit = "ms", before, after, note }: BenchmarkChartProps) {
  const max = Math.max(before.p50, before.p95, before.p99, after.p50, after.p95, after.p99);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden not-prose">
      <div className="px-4 py-2.5 border-b border-border bg-muted/30">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">{title}</span>
      </div>

      <div className="p-4 space-y-5">
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2.5 rounded-sm bg-muted-foreground/30" />
            <span className="text-muted-foreground">{before.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2.5 rounded-sm bg-primary" />
            <span className="text-muted-foreground">{after.label}</span>
          </div>
        </div>

        {METRICS.map(({ key, label }, metricIndex) => {
          const beforeVal = before[key];
          const afterVal = after[key];
          const improvement = Math.round((1 - afterVal / beforeVal) * 100);

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  -{improvement}%
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { val: beforeVal, color: "bg-muted-foreground/30", delay: metricIndex * 0.05 },
                  { val: afterVal, color: "bg-primary", delay: metricIndex * 0.05 + 0.08 },
                ].map(({ val, color, delay }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                      <motion.div
                        className={`h-full ${color} rounded`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(val / max) * 100}%` }}
                        transition={{ ...spring, delay }}
                      />
                    </div>
                    <span className="text-[10px] font-mono w-20 text-right text-muted-foreground tabular-nums">
                      {val.toLocaleString()}{unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {note && (
          <p className="text-[10px] text-muted-foreground/70 pt-2 border-t border-border">{note}</p>
        )}
      </div>
    </div>
  );
}
