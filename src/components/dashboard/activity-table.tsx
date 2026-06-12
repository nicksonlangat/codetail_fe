"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRecentActivity, type RecentActivityItem } from "@/lib/api/progress";
import { getPaths, type PathResponse } from "@/lib/api/paths";
import { StackLogo } from "@/components/brand/stack-logos";

const springFast = { type: "spring" as const, stiffness: 400, damping: 25 };

function EmptyPathCard({ path }: { path: PathResponse }) {
  return (
    <Link href={`/paths/${path.slug}`} className="block group cursor-pointer">
      <motion.div
        whileHover={{ y: -2 }}
        transition={springFast}
        className="relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-sm overflow-hidden h-full"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

        <div className="relative flex flex-col gap-4 flex-1">
          <StackLogo stack={path.stack} className="w-9 h-9 shrink-0" />

          <div className="flex-1 space-y-1.5">
            <h3 className="text-[14px] font-semibold tracking-tight leading-snug">{path.title}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{path.description}</p>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {path.topics.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">{t}</span>
            ))}
            {path.topics.length > 3 && (
              <span className="text-[10px] text-muted-foreground/50">+{path.topics.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-auto">
            <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
              {path.problem_count} problems
              <span className="mx-1.5 opacity-40">·</span>
              <span className="capitalize">{path.stack}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

const difficultyDot: Record<string, string> = {
  easy:   "bg-difficulty-easy",
  medium: "bg-difficulty-medium",
  hard:   "bg-difficulty-hard",
};

const scoreColor = (s: number) =>
  s >= 90 ? "text-green-500" : s >= 70 ? "text-primary" : s >= 50 ? "text-yellow-600" : "text-red-500";

const scoreBar = (s: number) =>
  s >= 90 ? "bg-green-500" : s >= 70 ? "bg-primary" : s >= 50 ? "bg-yellow-500" : "bg-red-500";

function StatusBadge({ status }: { status: string }) {
  if (status === "solved")
    return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20 shrink-0">Solved</span>;
  if (status === "attempted")
    return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">In progress</span>;
  return null;
}

function groupLabel(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return "This week";
  if (diffDays < 14) return "Last week";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupItems(items: RecentActivityItem[]) {
  const groups: { label: string; items: RecentActivityItem[] }[] = [];
  const seen = new Map<string, number>();
  for (const item of items) {
    if (!item.last_submission_at) continue;
    const label = groupLabel(item.last_submission_at);
    if (!seen.has(label)) { seen.set(label, groups.length); groups.push({ label, items: [] }); }
    groups[seen.get(label)!].items.push(item);
  }
  return groups;
}

function ActivityRow({ item, index }: { item: RecentActivityItem; index: number }) {
  return (
    <Link href={`/challenge/${item.path_slug}/${item.problem_id}`}>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: index * 0.03 }}
        className="flex items-center gap-4 px-5 py-4 hover:bg-muted/25 transition-colors duration-150 cursor-pointer group border-b border-border/40 last:border-0"
      >
        {/* Faded index */}
        <span className="text-[26px] font-black text-muted-foreground/10 tabular-nums w-9 shrink-0 leading-none select-none group-hover:text-muted-foreground/15 transition-colors duration-150">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150 truncate leading-tight">
            {item.problem_title}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${difficultyDot[item.difficulty] ?? "bg-muted-foreground/20"}`} />
            <span className="text-[11px] text-muted-foreground/50 capitalize">{item.difficulty}</span>
            <span className="text-muted-foreground/20">·</span>
            <span className="text-[11px] text-muted-foreground/40 truncate">
              {item.path_title}{item.unit ? ` · ${item.unit}` : ""}
            </span>
          </div>
        </div>

        {/* Right: status + score */}
        <div className="flex items-center gap-4 shrink-0">
          <StatusBadge status={item.status} />

          {item.best_score > 0 && (
            <div className="flex flex-col items-end gap-1 w-14">
              <span className={`text-[12px] font-bold font-mono tabular-nums ${scoreColor(item.best_score)}`}>
                {item.best_score}%
              </span>
              <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${scoreBar(item.best_score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.best_score}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.04 }}
                />
              </div>
            </div>
          )}

          <span className="text-[10px] text-muted-foreground/30 font-mono tabular-nums w-16 text-right">
            {timeAgo(item.last_submission_at)}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export function ActivityTable() {
  const [items, setItems]         = useState<RecentActivityItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);

  const { data: pathsData } = useQuery({
    queryKey: ["paths"],
    queryFn: () => getPaths(),
    staleTime: 60_000,
  });

  const loadMore = useCallback(async () => {
    if (allLoaded) return;
    setLoading(true);
    try {
      const data = await getRecentActivity(15, items.length);
      if (data.length < 15) setAllLoaded(true);
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.problem_id));
        return [...prev, ...data.filter((d) => d.last_submission_at && !seen.has(d.problem_id))];
      });
    } catch {
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [items.length, allLoaded]);

  useEffect(() => { loadMore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && items.length === 0) {
    return (
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-muted animate-pulse mb-4" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-18 rounded-xl bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    const paths = Array.isArray(pathsData) ? pathsData : [];
    return (
      <div className="py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recent</span>
        <p className="text-[13px] text-muted-foreground mt-4 mb-5">No submissions yet. Pick a path and start solving.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paths.map((path) => (
            <EmptyPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    );
  }

  const groups = groupItems(items);
  let globalIndex = 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recent</span>
        <span className="text-[10px] text-muted-foreground/40 tabular-nums">{items.length} solved</span>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/35 mb-2 px-1">
              {group.label}
            </p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {group.items.map((item) => {
                const idx = globalIndex++;
                return <ActivityRow key={item.problem_id} item={item} index={idx} />;
              })}
            </div>
          </div>
        ))}
      </div>

      {!allLoaded && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full mt-4 py-2.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer disabled:opacity-40"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
