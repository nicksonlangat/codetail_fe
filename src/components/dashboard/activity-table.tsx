"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Play, Clock, ArrowUp } from "lucide-react";
import Link from "next/link";
import { getRecentActivity, type RecentActivityItem } from "@/lib/api/progress";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const difficultyColor: Record<string, string> = {
  easy: "bg-green-500/15 text-green-600",
  medium: "bg-yellow-500/15 text-yellow-600",
  hard: "bg-red-500/15 text-red-600",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "solved") return <CheckCircle2 className="w-3 h-3 text-green-500" />;
  if (status === "attempted") return <XCircle className="w-3 h-3 text-amber-500" />;
  return <Play className="w-3 h-3 text-blue-500" />;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function ActivityTable() {
  const [items, setItems] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading && items.length > 0) return;
    if (allLoaded) return;
    setLoading(true);
    try {
      const data = await getRecentActivity(10, items.length);
      if (data.length === 0 || data.length < 10) setAllLoaded(true);
      setItems((prev) => [...prev, ...data]);
    } catch {
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [items.length, allLoaded, loading]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { root: container, threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    setShowTop(containerRef.current.scrollTop > 100);
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <div className="relative rounded-xl bg-card border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
          Recent Activity
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {items.length} problem{items.length !== 1 ? "s" : ""} attempted
        </p>
      </div>

      <div ref={containerRef} onScroll={handleScroll} className="max-h-[340px] overflow-y-auto scroll-smooth">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <Link key={`${item.problem_id}-${i}`} href={`/challenge/${item.path_slug}/${item.problem_id}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i >= items.length - 10 ? (i % 10) * 0.04 : 0 }}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 transition-all duration-500 hover:bg-muted/50 cursor-pointer group"
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  <StatusIcon status={item.status} />
                </div>

                {/* Title + path */}
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-foreground group-hover:text-primary transition-colors duration-300 truncate block">
                    {item.problem_title}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{item.path_title}</span>
                </div>

                {/* Score */}
                {item.best_score > 0 && (
                  <span className={`text-[10px] font-bold font-mono tabular-nums ${
                    item.best_score >= 90 ? "text-green-500"
                    : item.best_score >= 70 ? "text-primary"
                    : item.best_score >= 50 ? "text-yellow-600"
                    : "text-red-500"
                  }`}>
                    {item.best_score}
                  </span>
                )}

                {/* Difficulty */}
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${difficultyColor[item.difficulty] ?? ""}`}>
                  {item.difficulty}
                </span>

                {/* Time */}
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(item.last_submission_at)}
                </span>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>

        {/* Loading shimmer */}
        {loading && (
          <div className="px-4 py-2 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-8 rounded-lg bg-muted animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}

        {/* All loaded */}
        {allLoaded && items.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}
            className="px-4 py-4 text-center text-[11px] text-muted-foreground">
            You&apos;ve seen it all
          </motion.div>
        )}

        <div ref={sentinelRef} className="h-1" />
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={spring}
            onClick={scrollToTop}
            className="cursor-pointer absolute bottom-3 right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-500"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
