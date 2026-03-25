"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathProblems, type ProblemListItem } from "@/lib/api/paths";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { ProblemCardList } from "@/components/paths/problem-card";

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
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {section.label}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <ProblemCardList problems={section.problems} pathSlug={slug} />
        </motion.div>
      ))}
    </main>
  );
}

