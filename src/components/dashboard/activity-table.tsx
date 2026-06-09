"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { getRecentActivity, type RecentActivityItem } from "@/lib/api/progress";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d";
  return `${days}d`;
}

const scoreColor = (s: number) =>
  s >= 90 ? "text-green-500" : s >= 70 ? "text-primary" : s >= 50 ? "text-yellow-600" : "text-red-500";

const diffColor: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

function groupLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  if (diffDays < 14) return "Last week";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupItems(items: RecentActivityItem[]) {
  const groups: { label: string; items: RecentActivityItem[] }[] = [];
  const seen = new Map<string, number>();
  for (const item of items) {
    if (!item.last_submission_at) continue;
    const label = groupLabel(item.last_submission_at);
    if (!seen.has(label)) {
      seen.set(label, groups.length);
      groups.push({ label, items: [] });
    }
    groups[seen.get(label)!].items.push(item);
  }
  return groups;
}

export function ActivityTable() {
  const [items, setItems] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);

  const loadMore = useCallback(async () => {
    if (allLoaded) return;
    setLoading(true);
    try {
      const data = await getRecentActivity(15, items.length);
      if (data.length < 15) setAllLoaded(true);
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.problem_id));
        const fresh = data.filter((d) => d.last_submission_at && !seen.has(d.problem_id));
        return [...prev, ...fresh];
      });
    } catch {
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [items.length, allLoaded]);

  useEffect(() => { loadMore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Loading skeleton */
  if (loading && items.length === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recent</span>
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    );
  }

  /* Empty state */
  if (!loading && items.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recent</span>
        </div>
        <p className="text-[12px] text-muted-foreground py-4">No submissions yet — solve your first problem to see activity here.</p>
      </div>
    );
  }

  const groups = groupItems(items);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recent</span>
        <span className="text-[10px] text-muted-foreground/50 tabular-nums">{items.length} submissions</span>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[16px_1fr_110px_90px_52px_36px_52px_52px] gap-x-3 items-center px-4 py-2 border-b border-border/50 bg-muted/20">
          <div />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Problem</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Path</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Unit</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Status</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40 text-right">Score</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Level</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40 text-right">When</span>
        </div>

        {/* Grouped rows */}
        {groups.map((group, gi) => (
          <div key={group.label}>
            {/* Group separator */}
            <div className={`px-4 py-1 bg-muted/20 border-b border-border/30 ${gi > 0 ? "border-t border-border/30" : ""}`}>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                {group.label}
              </span>
            </div>

            {group.items.map((item, i) => (
              <Link key={`${item.problem_id}-${i}`} href={`/challenge/${item.path_slug}/${item.problem_id}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...spring, delay: i * 0.02 }}
                  className="grid grid-cols-[16px_1fr_110px_90px_52px_36px_52px_52px] gap-x-3 items-center px-4 py-2.5 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors duration-150 cursor-pointer group"
                >
                  {/* Status icon */}
                  {item.status === "solved"
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    : <Circle className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-muted-foreground/45 transition-colors duration-150" />
                  }

                  {/* Problem title */}
                  <span className="text-[12px] font-medium text-foreground group-hover:text-primary transition-colors duration-150 truncate">
                    {item.problem_title}
                  </span>

                  {/* Path */}
                  <span className="text-[10px] text-muted-foreground/60 truncate">{item.path_title}</span>

                  {/* Unit */}
                  <span className="text-[10px] text-muted-foreground/50 truncate">{item.unit || "—"}</span>

                  {/* Pass / Fail badge */}
                  {item.status === "solved" ? (
                    <span className="inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20 w-fit">
                      Passed
                    </span>
                  ) : item.status === "attempted" ? (
                    <span className="inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 w-fit">
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/40 w-fit">
                      Started
                    </span>
                  )}

                  {/* Score */}
                  <span className={`text-[11px] font-bold font-mono tabular-nums text-right ${
                    item.best_score > 0 ? scoreColor(item.best_score) : "text-muted-foreground/20"
                  }`}>
                    {item.best_score > 0 ? item.best_score : "—"}
                  </span>

                  {/* Difficulty */}
                  <span className={`text-[10px] font-semibold capitalize ${diffColor[item.difficulty] ?? "text-muted-foreground"}`}>
                    {item.difficulty}
                  </span>

                  {/* Time */}
                  <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums text-right">
                    {timeAgo(item.last_submission_at)}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        ))}

        {/* Load more */}
        {!allLoaded && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="w-full px-4 py-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors duration-150 cursor-pointer border-t border-border/20 text-center disabled:opacity-40"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}
