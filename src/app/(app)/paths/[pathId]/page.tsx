"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Check, Lock } from "lucide-react";
import { getPathById } from "@/data/paths";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { PathProblem } from "@/types";

export default function PathDetailPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const path = useMemo(() => getPathById(pathId), [pathId]);

  const completed = path
    ? path.problems.filter((p) => p.status === "completed").length
    : 0;
  const total = path ? path.problems.length : 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sections = useMemo(() => {
    if (!path) return [];
    const result: {
      label: string;
      problems: (PathProblem & { globalIdx: number })[];
    }[] = [];
    const sectionSize = Math.ceil(
      path.problems.length / Math.ceil(path.problems.length / 5)
    );
    for (let i = 0; i < path.problems.length; i += sectionSize) {
      const slice = path.problems
        .slice(i, i + sectionSize)
        .map((p, j) => ({ ...p, globalIdx: i + j }));
      const sectionNum = Math.floor(i / sectionSize) + 1;
      const labels = [
        "Foundations",
        "Core",
        "Intermediate",
        "Advanced",
        "Mastery",
      ];
      result.push({
        label: labels[sectionNum - 1] || `Part ${sectionNum}`,
        problems: slice,
      });
    }
    return result;
  }, [path]);

  if (!path) {
    return (
      <main className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Path not found.</p>
      </main>
    );
  }

  const Icon = getIcon(path.icon);

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <Link
          href="/paths"
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-75"
        >
          <ArrowLeft className="w-3 h-3" />
          Paths
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-foreground" />
          </div>
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
            {path.title}
          </h1>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-px h-auto rounded-full ${
              path.difficulty === "Beginner"
                ? "bg-difficulty-easy/10 text-difficulty-easy"
                : path.difficulty === "Intermediate"
                ? "bg-difficulty-medium/10 text-difficulty-medium"
                : "bg-difficulty-hard/10 text-difficulty-hard"
            }`}
          >
            {path.difficulty}
          </Badge>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          {path.description}
        </p>

        {/* Progress strip */}
        <div className="flex items-center gap-3 mt-4">
          <Progress value={pct} className="flex-1 h-[3px]" />
          <span className="text-[11px] text-muted-foreground tabular-nums font-mono">
            {completed}/{total}
          </span>
        </div>
      </motion.div>

      {/* Sections */}
      {sections.map((section, si) => (
        <motion.div
          key={section.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + si * 0.06 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {section.label}
            </span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <div className="border border-border/60 rounded-lg overflow-hidden divide-y divide-border/40">
            {section.problems.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                index={problem.globalIdx}
                pathId={path.id}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </main>
  );
}

function ProblemRow({
  problem,
  index,
  pathId,
}: {
  problem: PathProblem & { globalIdx: number };
  index: number;
  pathId: string;
}) {
  const isCompleted = problem.status === "completed";
  const isCurrent = problem.status === "current";
  const isLocked = problem.status === "locked";

  const row = (
    <div
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors duration-75 group ${
        isCurrent
          ? "bg-accent/30"
          : isLocked
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-secondary/40"
      }`}
    >
      {/* Status dot */}
      <div className="w-5 flex items-center justify-center flex-shrink-0">
        {isCompleted ? (
          <div className="w-[7px] h-[7px] rounded-full bg-primary" />
        ) : isCurrent ? (
          <div className="relative">
            <div className="w-[7px] h-[7px] rounded-full bg-primary" />
            <div className="absolute inset-0 w-[7px] h-[7px] rounded-full bg-primary/40 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-[2.2]" />
          </div>
        ) : (
          <div className="w-[7px] h-[7px] rounded-full border border-border" />
        )}
      </div>

      {/* Number */}
      <span
        className={`text-[11px] font-mono tabular-nums w-4 ${
          isLocked ? "text-muted-foreground/40" : "text-muted-foreground"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title + concept */}
      <div className="flex-1 min-w-0 flex items-baseline gap-2">
        <span
          className={`text-[13px] truncate ${
            isLocked
              ? "text-muted-foreground/40"
              : isCurrent
              ? "font-medium text-foreground"
              : "text-foreground"
          } ${
            !isLocked
              ? "group-hover:text-primary transition-colors duration-75"
              : ""
          }`}
        >
          {problem.title}
        </span>
        <span
          className={`text-[10px] hidden sm:inline truncate ${
            isLocked ? "text-muted-foreground/25" : "text-muted-foreground/50"
          }`}
        >
          {problem.concept}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span
          className={`text-[10px] font-medium ${
            isLocked ? "opacity-30" : ""
          } ${
            problem.difficulty === "Easy"
              ? "text-difficulty-easy"
              : problem.difficulty === "Medium"
              ? "text-difficulty-medium"
              : "text-difficulty-hard"
          }`}
        >
          {problem.difficulty}
        </span>
        <span
          className={`flex items-center gap-0.5 text-[10px] tabular-nums font-mono ${
            isLocked ? "text-muted-foreground/25" : "text-muted-foreground/50"
          }`}
        >
          <Clock className="w-2.5 h-2.5" />
          {problem.timeEstimate}
        </span>
      </div>
    </div>
  );

  if (isLocked) {
    return row;
  }

  return (
    <Link href={`/challenge/${pathId}/${problem.id}`} className="block">
      {row}
    </Link>
  );
}
