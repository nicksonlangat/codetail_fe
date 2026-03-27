"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathProblems, type ProblemListItem } from "@/lib/api/paths";
import { getGeneratedProblems } from "@/lib/api/submissions";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { ProblemCardList } from "@/components/paths/problem-card";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";

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

  const { data: generated, refetch: refetchGenerated } = useQuery({
    queryKey: ["generated-problems", slug],
    queryFn: () => getGeneratedProblems(slug),
    enabled: !!path,
  });

  const [generateOpen, setGenerateOpen] = useState(false);

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
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {/* Path header skeleton */}
        <div className="mb-6">
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-border/30 animate-pulse" />
            <div className="h-5 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-72 bg-muted rounded animate-pulse" />
          <div className="h-2.5 w-20 bg-muted rounded animate-pulse mt-1" />
        </div>

        {/* Section skeletons */}
        {[1, 2].map((s) => (
          <div key={s} className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="h-2.5 w-20 bg-muted rounded animate-pulse" />
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((p) => (
                <div key={p} className="rounded-lg border border-border/50 p-4 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-border/30 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-44 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-2.5 w-12 bg-muted rounded-full animate-pulse" />
                      <div className="h-2.5 w-20 bg-muted rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
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
            problems={generated.map((p, i) => ({ ...p, idx: (problems?.length ?? 0) + i }))}
            pathSlug={slug}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 p-5 text-center">
            <p className="text-[12px] text-muted-foreground mb-2">No AI-generated challenges yet</p>
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
        onClose={() => { setGenerateOpen(false); refetchGenerated(); }}
        pathSlug={slug}
        pathStack={path.stack}
      />
    </main>
  );
}

