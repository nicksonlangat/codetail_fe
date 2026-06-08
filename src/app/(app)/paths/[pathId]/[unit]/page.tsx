"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Lock, WandSparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathProblems } from "@/lib/api/paths";
import { deleteGeneratedProblem } from "@/lib/api/submissions";
import { ProblemCardList } from "@/components/paths/problem-card";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const shimmer =
  "bg-muted relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

export default function UnitPage() {
  const { pathId: slug, unit } = useParams<{ pathId: string; unit: string }>();
  const [generatedOpen, setGeneratedOpen] = useState(true);

  const { data: path } = useQuery({
    queryKey: ["path", slug],
    queryFn: () => getPath(slug),
  });

  const { data: problems, isLoading, refetch } = useQuery({
    queryKey: ["path-problems", slug, unit],
    queryFn: () => getPathProblems(slug, unit),
  });

  const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1);

  const { curated, generated } = useMemo(() => {
    const all = problems ?? [];
    return {
      curated: all.filter((p) => !p.is_generated).map((p, i) => ({ ...p, idx: i })),
      generated: all.filter((p) => p.is_generated).map((p, i) => ({ ...p, idx: i })),
    };
  }, [problems]);

  const freeCount = curated.filter((p) => p.is_free).length;
  const lockedCount = curated.filter((p) => p.locked).length;

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className={`h-3 w-28 rounded ${shimmer}`} />
        </div>
        <div className="mb-8 space-y-2">
          <div className={`h-5 w-32 rounded ${shimmer}`} />
          <div className={`h-3 w-40 rounded ${shimmer}`} />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-3"
            >
              <div className={`w-4 h-4 rounded-full ${shimmer}`} />
              <div className="flex-1 space-y-1.5">
                <div className={`h-3.5 w-44 rounded ${shimmer}`} />
                <div className="flex gap-2">
                  <div className={`h-2.5 w-12 rounded-full ${shimmer}`} />
                  <div className={`h-2.5 w-20 rounded-full ${shimmer}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      {/* Back to path */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href={`/paths/${slug}`}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
        >
          <ArrowLeft className="w-3 h-3" /> {path?.title ?? "Path"}
        </Link>
      </motion.div>

      {/* Unit header */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-8"
      >
        <h1 className="text-[15px] font-semibold tracking-tight">{unitLabel}</h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
            {curated.length} problems
          </span>
          <span className="text-[10px] text-primary/80 bg-primary/8 border border-primary/15 px-1.5 py-px rounded-full">
            {freeCount} free
          </span>
          {lockedCount > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
              <Lock className="w-2.5 h-2.5" />
              {lockedCount} pro
            </span>
          )}
        </div>
      </motion.div>

      {/* Curated problems */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <ProblemCardList problems={curated} pathSlug={slug} />
      </motion.div>

      {/* AI-generated subsection */}
      {generated.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.15 }}
          className="mt-8"
        >
          <button
            onClick={() => setGeneratedOpen((o) => !o)}
            className="w-full flex items-center gap-2 mb-3 cursor-pointer group"
          >
            <WandSparkles className="w-3 h-3 text-primary/60" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-150">
              Your AI Challenges
            </span>
            <span className="text-[9px] font-mono text-muted-foreground/30 tabular-nums">
              {generated.length}
            </span>
            <div className="flex-1 h-px bg-border/40" />
            <motion.div animate={{ rotate: generatedOpen ? 90 : 0 }} transition={spring}>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {generatedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={spring}
                className="overflow-hidden"
              >
                <ProblemCardList
                  problems={generated}
                  pathSlug={slug}
                  onDelete={async (id) => {
                    await deleteGeneratedProblem(id);
                    refetch();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}
