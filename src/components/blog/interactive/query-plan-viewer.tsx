"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type PlanState = "before" | "after";

function lineClass(line: string): string {
  if (/Seq Scan/i.test(line)) return "bg-red-500/10 text-red-700 dark:text-red-400";
  if (/Index Scan|Index Only Scan/i.test(line)) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (/external merge|Disk:/i.test(line)) return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  if (/Rows Removed by Filter/i.test(line)) return "bg-amber-500/8 text-amber-700/80 dark:text-amber-400/80";
  if (/Execution Time/i.test(line)) return "font-semibold text-foreground";
  return "text-foreground/70";
}

const BEFORE = `-- GET /tasks?skip=10000&limit=20  (table: 100K rows)
EXPLAIN ANALYZE
  SELECT * FROM tasks
  ORDER BY created_at DESC
  OFFSET 10000 LIMIT 20;

Limit  (cost=12045.72..12046.14 rows=20 width=116)
       (actual time=1247.845..1247.860 rows=20 loops=1)
  ->  Sort  (cost=11920.72..12170.72 rows=100000 width=116)
            (actual time=1238.210..1245.330 rows=10020 loops=1)
        Sort Key: created_at DESC
        Sort Method: external merge  Disk: 11648kB
        ->  Seq Scan on tasks
              (cost=0.00..1650.00 rows=100000 width=116)
              (actual time=0.018..831.420 rows=100000 loops=1)
              Rows Removed by Filter: 0
Planning Time: 0.189 ms
Execution Time: 1247.934 ms`;

const AFTER = `-- GET /tasks?cursor=2026-01-15T10:30:00&limit=20  (table: 100K rows)
EXPLAIN ANALYZE
  SELECT * FROM tasks
  WHERE created_at < '2026-01-15 10:30:00'
  ORDER BY created_at DESC
  LIMIT 21;

Limit  (cost=0.42..1.93 rows=20 width=116)
       (actual time=0.062..0.083 rows=20 loops=1)
  ->  Index Scan using idx_tasks_created_at on tasks
        (cost=0.42..7543.42 rows=100000 width=116)
        (actual time=0.060..0.079 rows=20 loops=1)
        Index Cond: (created_at < '2026-01-15 10:30:00')
Planning Time: 0.154 ms
Execution Time: 0.112 ms`;

const LEGEND = [
  { Icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", label: "Sequential scan — reads every row" },
  { Icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Index scan — jumps to matching rows" },
  { Icon: Info, color: "text-amber-500", bg: "bg-amber-500/10", label: "Disk spill — sort did not fit in memory" },
];

export function QueryPlanViewer() {
  const [state, setState] = useState<PlanState>("before");
  const plan = state === "before" ? BEFORE : AFTER;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">
          EXPLAIN ANALYZE output
        </span>
        <div className="flex gap-1">
          {(["before", "after"] as PlanState[]).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer ${
                state === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "before" ? "Before index" : "After index"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div className="overflow-x-auto bg-muted/50">
            <table className="w-full font-mono text-[10px] border-collapse">
              <tbody>
                {plan.split("\n").map((line, i) => (
                  <tr key={i}>
                    <td className={`px-4 py-0.5 leading-relaxed whitespace-pre ${lineClass(line)}`}>
                      {line || " "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="px-4 py-3 border-t border-border flex flex-wrap gap-3">
        {LEGEND.map(({ Icon, color, bg, label }) => (
          <div key={label} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md ${bg}`}>
            <Icon className={`w-3 h-3 ${color}`} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
