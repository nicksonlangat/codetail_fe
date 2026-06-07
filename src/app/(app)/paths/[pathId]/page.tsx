"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Lock, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathUnits } from "@/lib/api/paths";
import { getGeneratedProblems } from "@/lib/api/submissions";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { ProblemCardList } from "@/components/paths/problem-card";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const shimmer =
  "bg-muted relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

export default function PathDetailPage() {
  const { pathId: slug } = useParams<{ pathId: string }>();
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data: path, isLoading: pathLoading } = useQuery({
    queryKey: ["path", slug],
    queryFn: () => getPath(slug),
  });

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ["path-units", slug],
    queryFn: () => getPathUnits(slug),
    enabled: !!path,
  });

  const { data: generated, refetch: refetchGenerated } = useQuery({
    queryKey: ["generated-problems", slug],
    queryFn: () => getGeneratedProblems(slug),
    enabled: !!path,
  });

  const isLoading = pathLoading || unitsLoading;
  const totalProblems = units?.reduce((s, u) => s + u.total, 0) ?? 0;

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="mb-6">
            <div className={`h-3 w-16 rounded ${shimmer}`} />
          </div>
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg ${shimmer}`} />
              <div className={`h-5 w-48 rounded ${shimmer}`} />
              <div className={`h-4 w-16 rounded-full ${shimmer}`} />
            </div>
            <div className={`h-3 w-72 rounded ${shimmer}`} />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-14 rounded-xl ${shimmer}`} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!path) {
    return (
      <main className="flex items-center justify-center py-20">
        <p className="text-[13px] text-muted-foreground">Path not found.</p>
      </main>
    );
  }

  const Icon = getIcon(path.icon);
  const diffColor =
    path.difficulty === "beginner"
      ? "bg-difficulty-easy/10 text-difficulty-easy"
      : path.difficulty === "intermediate"
      ? "bg-difficulty-medium/10 text-difficulty-medium"
      : "bg-difficulty-hard/10 text-difficulty-hard";

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href="/paths"
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
        >
          <ArrowLeft className="w-3 h-3" /> Paths
        </Link>
      </motion.div>

      {/* Path header */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-foreground" />
          </div>
          <h1 className="text-[15px] font-semibold tracking-tight">{path.title}</h1>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-px h-auto rounded-full ${diffColor}`}
          >
            {path.difficulty}
          </Badge>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">{path.description}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono tabular-nums">
          {units?.length ?? 0} units · {totalProblems} problems
        </p>
      </motion.div>

      {/* Unit cards */}
      <div className="space-y-2 mb-8">
        {units?.map((unit, i) => {
          const progressPct = unit.total > 0 ? (unit.solved / unit.total) * 100 : 0;
          return (
            <motion.div
              key={unit.unit}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
            >
              <Link href={`/paths/${slug}/${unit.unit}`}>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={spring}
                  className="flex items-center gap-4 px-4 py-3.5 bg-card border border-border rounded-xl cursor-pointer hover:border-primary/30 transition-all duration-500"
                >
                  {/* Index */}
                  <span className="text-[11px] font-mono tabular-nums text-muted-foreground/40 w-5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium leading-tight">{unit.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                        {unit.total} problems
                      </span>
                      <span className="text-[10px] text-primary/80 bg-primary/8 border border-primary/15 px-1.5 py-px rounded-full">
                        {unit.free} free
                      </span>
                      {unit.total - unit.free > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
                          <Lock className="w-2.5 h-2.5" />
                          {unit.total - unit.free} pro
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {unit.solved > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-primary">
                        {unit.solved}/{unit.total}
                      </span>
                    </div>
                  )}

                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* AI Generated section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2 px-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">
            AI Generated
          </span>
          <div className="flex-1 h-px bg-border" />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setGenerateOpen(true)}
            className="flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 cursor-pointer transition-all duration-500"
          >
            <Sparkles className="w-3 h-3" /> Generate New
          </motion.button>
        </div>

        {generated && generated.length > 0 ? (
          <ProblemCardList
            problems={generated.map((p, i) => ({ ...p, idx: i }))}
            pathSlug={slug}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 p-5 text-center">
            <p className="text-[12px] text-muted-foreground mb-2">
              No AI-generated challenges yet
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setGenerateOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500"
            >
              <Sparkles className="w-3 h-3" /> Generate Your First Challenge
            </motion.button>
          </div>
        )}
      </motion.div>

      <GenerateChallengeDialog
        open={generateOpen}
        onClose={() => {
          setGenerateOpen(false);
          refetchGenerated();
        }}
        pathSlug={slug}
        pathStack={path.stack}
      />
    </main>
  );
}
