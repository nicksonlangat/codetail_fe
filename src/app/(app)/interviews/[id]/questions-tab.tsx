"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Code2, Wrench,
  HelpCircle, RefreshCcw, Loader2, BookOpen,
} from "lucide-react";
import { getProblem } from "@/lib/api/paths";
import type { ProblemDetail } from "@/lib/api/paths";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { ProblemDrawer } from "./problem-drawer";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const difficultyDot: Record<string, string> = {
  easy:   "bg-difficulty-easy",
  medium: "bg-difficulty-medium",
  hard:   "bg-difficulty-hard",
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  write_code: { label: "Code",     icon: <Code2      className="w-3 h-3" />, color: "text-blue-500 dark:text-blue-400"    },
  fix_code:   { label: "Fix",      icon: <Wrench     className="w-3 h-3" />, color: "text-orange-500 dark:text-orange-400" },
  mcq:        { label: "MCQ",      icon: <HelpCircle className="w-3 h-3" />, color: "text-purple-500 dark:text-purple-400" },
  refactor:   { label: "Refactor", icon: <RefreshCcw className="w-3 h-3" />, color: "text-emerald-500 dark:text-emerald-400"},
};

interface Problem {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  stack: string;
  concept: string;
}

function ProblemCard({
  problem, index, expanded, full, fetching, onToggle, onPrefetch, onReadMore,
}: {
  problem: Problem;
  index: number;
  expanded: boolean;
  full: ProblemDetail | null;
  fetching: boolean;
  onToggle: () => void;
  onPrefetch: () => void;
  onReadMore: (full: ProblemDetail) => void;
}) {
  const tc = typeConfig[problem.type];

  return (
    <motion.div layout="position" className="bg-card border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div
        onClick={onToggle}
        onMouseEnter={onPrefetch}
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors duration-150 group"
      >
        <span className="text-[28px] font-bold text-muted-foreground/12 tabular-nums w-10 shrink-0 leading-none select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150 mb-1">
            {problem.title}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${difficultyDot[problem.difficulty] ?? "bg-muted-foreground/20"}`} />
            <span className="text-[11px] text-muted-foreground/50 capitalize">{problem.difficulty}</span>
            {problem.concept && (
              <>
                <span className="text-muted-foreground/20">·</span>
                <span className="text-[11px] text-muted-foreground/40">{problem.concept}</span>
              </>
            )}
            {problem.stack && (
              <>
                <span className="text-muted-foreground/20">·</span>
                <span className="text-[11px] text-muted-foreground/40">{problem.stack}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {tc && (
            <span className={`hidden sm:flex items-center gap-1 text-[10px] font-medium ${tc.color}`}>
              {tc.icon} {tc.label}
            </span>
          )}
          <div className="text-muted-foreground/30">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded panel — fixed 180px */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 180, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 28 } }}
            exit={{ height: 0, opacity: 0, transition: { type: "spring", stiffness: 320, damping: 36 } }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 h-full flex flex-col">
              {/* Description preview */}
              <div className="flex-1 relative px-5 pt-4 pb-0 overflow-hidden">
                {fetching || !full ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 className="w-3 h-3 text-muted-foreground/30 animate-spin" />
                  </div>
                ) : full.description ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] text-muted-foreground/70 leading-relaxed"
                  >
                    <TipTapRenderer content={full.description} />
                  </motion.div>
                ) : null}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-card to-transparent pointer-events-none" />
              </div>

              {/* Footer: meta + Read more */}
              <div className="flex items-center justify-between px-5 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${tc?.color ?? "text-muted-foreground"}`}>
                    {tc?.icon} {tc?.label ?? problem.type}
                  </span>
                  <span className="text-muted-foreground/20">·</span>
                  <span className="text-[11px] text-muted-foreground/50 capitalize">{problem.difficulty}</span>
                  {problem.stack && (
                    <>
                      <span className="text-muted-foreground/20">·</span>
                      <span className="text-[11px] text-muted-foreground/50">{problem.stack}</span>
                    </>
                  )}
                </div>
                <motion.button
                  onClick={e => { e.stopPropagation(); if (full) onReadMore(full); }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  disabled={!full}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/15 disabled:opacity-40 cursor-pointer transition-all duration-300"
                >
                  <BookOpen className="w-3 h-3" />
                  Read more
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuestionsTab({ problems }: { problems: Problem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drawerProblem, setDrawerProblem] = useState<{ full: ProblemDetail; index: number } | null>(null);
  const [fullCache, setFullCache] = useState<Record<string, ProblemDetail>>({});
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  function fetchFull(id: string): Promise<ProblemDetail | null> {
    if (fullCache[id]) return Promise.resolve(fullCache[id]);
    setFetchingId(id);
    return getProblem(id)
      .then(d => { setFullCache(c => ({ ...c, [id]: d })); return d; })
      .catch(() => null)
      .finally(() => setFetchingId(f => (f === id ? null : f)));
  }

  function prefetch(id: string) {
    if (!fullCache[id] && fetchingId !== id) fetchFull(id);
  }

  function openDrawer(full: ProblemDetail, index: number) {
    setFullCache(c => ({ ...c, [full.id]: full }));
    setDrawerProblem({ full, index });
  }

  function navigateDrawer(dir: 1 | -1) {
    if (!drawerProblem) return;
    const next = drawerProblem.index + dir;
    if (next < 0 || next >= problems.length) return;
    const target = problems[next];
    if (fullCache[target.id]) {
      setDrawerProblem({ full: fullCache[target.id], index: next });
    } else {
      setNavigating(true);
      fetchFull(target.id).then(d => {
        if (d) setDrawerProblem({ full: d, index: next });
      }).finally(() => setNavigating(false));
    }
  }

  return (
    <>
      <div className="space-y-3">
        {problems.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.04 }}
          >
            <ProblemCard
              problem={problem}
              index={i}
              expanded={expandedId === problem.id}
              full={fullCache[problem.id] ?? null}
              fetching={fetchingId === problem.id}
              onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
              onPrefetch={() => prefetch(problem.id)}
              onReadMore={full => openDrawer(full, i)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {drawerProblem && (
          <ProblemDrawer
            problem={{
              id: drawerProblem.full.id,
              title: drawerProblem.full.title,
              type: drawerProblem.full.type,
              difficulty: drawerProblem.full.difficulty,
              stack: drawerProblem.full.stack,
              unit: drawerProblem.full.unit ?? "",
              concept: drawerProblem.full.concept,
              description: drawerProblem.full.description,
              function_signature: drawerProblem.full.function_signature ?? null,
              starter_code: drawerProblem.full.starter_code,
              examples: drawerProblem.full.examples,
              hints: [],
              mcq_options: drawerProblem.full.mcq_options ?? [],
              files: drawerProblem.full.files ?? [],
            }}
            index={drawerProblem.index}
            total={problems.length}
            onPrev={() => navigateDrawer(-1)}
            onNext={() => navigateDrawer(1)}
            navigating={navigating}
            onClose={() => setDrawerProblem(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
