"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const shimmerClass =
  "bg-muted relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

/* ── Skeleton versions ── */
function SkeletonProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-3 w-28 rounded ${shimmerClass}`} />
        <div className={`h-2.5 w-40 rounded ${shimmerClass}`} />
      </div>
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`h-16 rounded-lg ${shimmerClass}`} />
      ))}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${shimmerClass}`} />
          <div className="flex-1 space-y-1.5">
            <div className={`h-3 rounded ${shimmerClass}`} style={{ width: `${60 + i * 8}%` }} />
            <div className={`h-2 w-20 rounded ${shimmerClass}`} />
          </div>
          <div className={`h-5 w-14 rounded-full ${shimmerClass}`} />
        </div>
      ))}
    </div>
  );
}

/* ── Real content versions ── */
function RealProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
        AK
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Alex Kim</p>
        <p className="text-xs text-muted-foreground">Full-stack developer</p>
      </div>
    </div>
  );
}

function RealStats() {
  const stats = [
    { label: "Solved", value: "247" },
    { label: "Streak", value: "14d" },
    { label: "Rank", value: "#342" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="h-16 rounded-lg bg-card border border-border/50 flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold font-mono tabular-nums text-foreground">
            {s.value}
          </span>
          <span className="text-[10px] text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function RealList() {
  const items = [
    { initials: "TS", name: "Two Sum", tag: "Easy", tagColor: "bg-green-500/10 text-green-500" },
    { initials: "LL", name: "Linked List Cycle", tag: "Medium", tagColor: "bg-yellow-500/10 text-yellow-500" },
    { initials: "BT", name: "Binary Tree Inorder", tag: "Easy", tagColor: "bg-green-500/10 text-green-500" },
    { initials: "MS", name: "Merge Sort Array", tag: "Hard", tagColor: "bg-red-500/10 text-red-500" },
  ];
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
            {item.initials}
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">{item.name}</p>
            <p className="text-[10px] text-muted-foreground">Completed 2d ago</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.tagColor}`}>
            {item.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SkeletonLoading() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="py-6">
      {/* Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLoaded(!loaded)}
          className="relative w-10 h-5 rounded-full cursor-pointer transition-all duration-500"
          style={{ backgroundColor: loaded ? "hsl(164 70% 40%)" : "hsl(var(--muted))" }}
        >
          <motion.div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            animate={{ left: loaded ? 22 : 2 }}
            transition={spring}
          />
        </button>
        <span className="text-xs text-muted-foreground">
          {loaded ? "Loaded" : "Loading"}
        </span>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border/50 p-5 space-y-6">
        <AnimatePresence mode="wait">
          {!loaded ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SkeletonProfile />
              <SkeletonStats />
              <SkeletonList />
            </motion.div>
          ) : (
            <motion.div
              key="real"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className="space-y-6"
            >
              <RealProfile />
              <RealStats />
              <RealList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shimmer keyframe injection */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
