"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Loader2, Lock, CheckCircle2, Circle, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathProblems, type ProblemListItem } from "@/lib/api/paths";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function PathDetailPage() {
  const { pathId: slug } = useParams<{ pathId: string }>();

  const { data: path, isLoading: pathLoading } = useQuery({
    queryKey: ["path", slug],
    queryFn: () => getPath(slug),
  });

  const { data: problems, isLoading: problemsLoading } = useQuery({
    queryKey: ["path-problems", slug],
    queryFn: () => getPathProblems(slug),
    enabled: !!path,
  });

  const isLoading = pathLoading || problemsLoading;

  const sections = useMemo(() => {
    if (!problems?.length) return [];
    const sectionSize = Math.ceil(problems.length / Math.ceil(problems.length / 5));
    const labels = ["Foundations", "Core", "Intermediate", "Advanced", "Mastery"];
    const result: { label: string; problems: (ProblemListItem & { idx: number })[] }[] = [];
    for (let i = 0; i < problems.length; i += sectionSize) {
      result.push({
        label: labels[result.length] || `Part ${result.length + 1}`,
        problems: problems.slice(i, i + sectionSize).map((p, j) => ({ ...p, idx: i + j })),
      });
    }
    return result;
  }, [problems]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
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
  const diffColor = path.difficulty === "beginner"
    ? "bg-difficulty-easy/10 text-difficulty-easy"
    : path.difficulty === "intermediate"
    ? "bg-difficulty-medium/10 text-difficulty-medium"
    : "bg-difficulty-hard/10 text-difficulty-hard";

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link href="/paths" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
          <ArrowLeft className="w-3 h-3" /> Paths
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-foreground" />
          </div>
          <h1 className="text-[15px] font-semibold tracking-tight">{path.title}</h1>
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-px h-auto rounded-full ${diffColor}`}>
            {path.difficulty}
          </Badge>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">{path.description}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono tabular-nums">
          {problems?.length ?? 0} problems
        </p>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div
          key={section.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.1 + si * 0.06 }}
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
              <ProblemRow key={problem.id} problem={problem} pathSlug={slug} />
            ))}
          </div>
        </motion.div>
      ))}
    </main>
  );
}

function ProblemRow({ problem, pathSlug }: { problem: ProblemListItem & { idx: number }; pathSlug: string }) {
  const diffColor = problem.difficulty === "easy"
    ? "text-difficulty-easy" : problem.difficulty === "medium"
    ? "text-difficulty-medium" : "text-difficulty-hard";

  const typeLabel: Record<string, string> = {
    write_code: "Code",
    mcq: "MCQ",
    fix_code: "Fix",
    refactor: "Refactor",
  };

  if (problem.locked) {
    return (
      <div className="w-full text-left flex items-center gap-3 px-3 py-2.5 opacity-50 cursor-default">
        <span className="text-[11px] font-mono tabular-nums w-5 text-muted-foreground/40">
          {String(problem.idx + 1).padStart(2, "0")}
        </span>
        <Lock className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="text-[13px] text-muted-foreground/50 truncate">{problem.title}</span>
        </div>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary cursor-pointer transition-all duration-500 hover:bg-primary/20">
          Upgrade
        </span>
      </div>
    );
  }

  return (
    <Link href={`/challenge/${pathSlug}/${problem.id}`} className="block cursor-pointer">
      <div className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/40 transition-all duration-500 group">
        {/* Status indicator */}
        {problem.user_status === "solved" ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : problem.user_status === "attempted" ? (
          <Minus className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/20 flex-shrink-0" />
        )}

        <span className="text-[11px] font-mono tabular-nums w-5 text-muted-foreground">
          {String(problem.idx + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="text-[13px] text-foreground group-hover:text-primary transition-all duration-500 truncate">
            {problem.title}
          </span>
          <span className="text-[10px] text-muted-foreground/40 hidden sm:inline">{problem.concept}</span>
        </div>

        {problem.best_score != null && problem.best_score > 0 && (
          <span className={`text-[10px] font-mono tabular-nums font-medium ${
            problem.best_score >= 90 ? "text-green-500" : problem.best_score >= 50 ? "text-yellow-500" : "text-red-500"
          }`}>
            {problem.best_score}%
          </span>
        )}

        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/60">
          {typeLabel[problem.type] ?? problem.type}
        </span>
        <span className={`text-[10px] font-medium ${diffColor}`}>
          {problem.difficulty}
        </span>
        <span className="flex items-center gap-0.5 text-[10px] tabular-nums font-mono text-muted-foreground/40">
          <Clock className="w-2.5 h-2.5" />
          {problem.time_estimate}
        </span>
      </div>
    </Link>
  );
}
