"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Clock } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const difficulties = ["Easy", "Medium", "Hard"] as const;
const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/15 text-green-600",
  Medium: "bg-yellow-500/15 text-yellow-600",
  Hard: "bg-red-500/15 text-red-600",
};

const titles = [
  "Two Sum", "Valid Parentheses", "Merge Intervals", "LRU Cache",
  "Binary Search", "Climbing Stairs", "Max Subarray", "Reverse Linked List",
  "Group Anagrams", "3Sum", "Container With Most Water", "Longest Substring",
  "Median of Two Sorted Arrays", "Trapping Rain Water", "Valid Sudoku",
  "Rotate Image", "Spiral Matrix", "Jump Game", "Merge Sorted Array",
  "Word Break", "Product of Array", "Min Stack", "Decode Ways",
  "Course Schedule", "Coin Change", "Number of Islands", "Clone Graph",
  "Word Search", "Subsets", "Permutations",
];

function generateItem(index: number) {
  const seed = (index * 7 + 13) % 100;
  const diff = difficulties[seed % 3];
  const time = [8, 12, 15, 20, 25, 30, 35, 45][seed % 8];
  return {
    id: index,
    title: titles[index % titles.length],
    difficulty: diff,
    time: `${time}m`,
  };
}

export function InfiniteScroll() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 10 }, (_, i) => generateItem(i))
  );
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || allLoaded) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const next = prev.length;
        if (next >= 30) {
          setAllLoaded(true);
          setLoading(false);
          return prev;
        }
        const count = Math.min(5, 30 - next);
        const newItems = Array.from({ length: count }, (_, i) =>
          generateItem(next + i)
        );
        return [...prev, ...newItems];
      });
      setLoading(false);
    }, 800);
  }, [loading, allLoaded]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: container, threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    setShowTop(containerRef.current.scrollTop > 150);
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative rounded-xl bg-card border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
          Problem Queue
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {items.length} of 30 problems loaded
        </p>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="max-h-[300px] overflow-y-auto scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i >= items.length - 5 ? (i % 5) * 0.06 : 0 }}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 transition-all duration-500 hover:bg-muted/50 cursor-pointer"
            >
              <span className="text-[10px] font-mono text-muted-foreground/50 w-5 text-right tabular-nums">
                {item.id + 1}
              </span>
              <span className="flex-1 text-[12px] font-medium text-foreground truncate">
                {item.title}
              </span>
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${difficultyColor[item.difficulty]}`}
              >
                {item.difficulty}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {item.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="px-4 py-2 space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-8 rounded-lg bg-muted animate-pulse transition-all duration-500"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}

        {allLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={spring}
            className="px-4 py-4 text-center text-[11px] text-muted-foreground"
          >
            You&apos;ve seen them all
          </motion.div>
        )}

        <div ref={sentinelRef} className="h-1" />
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={spring}
            onClick={scrollToTop}
            className="cursor-pointer absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transition-all duration-500 hover:bg-primary/90"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
