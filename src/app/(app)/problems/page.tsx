"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Circle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { paths } from "@/data/paths";
import type { PathProblem, Difficulty, ProblemStatus } from "@/types";

interface FlatProblem extends PathProblem {
  pathId: string;
  pathTitle: string;
}

const allProblems: FlatProblem[] = paths.flatMap((path) =>
  path.problems.map((p) => ({
    ...p,
    pathId: path.id,
    pathTitle: path.title,
  }))
);

const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-red-500",
};

const difficultyBadgeVariant: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcon: Record<ProblemStatus, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  current: <Circle className="w-4 h-4 text-primary" />,
  locked: <Lock className="w-4 h-4 text-muted-foreground/40" />,
};

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "All">("All");
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | "All">("All");

  const filtered = useMemo(() => {
    let result = allProblems;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.concept.toLowerCase().includes(q) ||
          p.pathTitle.toLowerCase().includes(q)
      );
    }
    if (filterDifficulty !== "All") {
      result = result.filter((p) => p.difficulty === filterDifficulty);
    }
    if (filterStatus !== "All") {
      result = result.filter((p) => p.status === filterStatus);
    }
    return result;
  }, [search, filterDifficulty, filterStatus]);

  const completedCount = allProblems.filter((p) => p.status === "completed").length;

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Problems</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {completedCount} of {allProblems.length} solved
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {completedCount} solved
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-primary" />{" "}
            {allProblems.filter((p) => p.status === "current").length} in progress
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="pl-9 h-9"
          />
        </div>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | "All")}
          className="text-xs font-medium text-muted-foreground bg-transparent px-2.5 py-2 rounded-lg ring-1 ring-border/50 hover:ring-border outline-none transition-all cursor-pointer h-9"
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ProblemStatus | "All")}
          className="text-xs font-medium text-muted-foreground bg-transparent px-2.5 py-2 rounded-lg ring-1 ring-border/50 hover:ring-border outline-none transition-all cursor-pointer h-9"
        >
          <option value="All">All status</option>
          <option value="completed">Completed</option>
          <option value="current">In Progress</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg ring-1 ring-border/50 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[32px_1fr_120px_80px_80px_140px_60px] items-center px-3 py-2 bg-muted/50 border-b border-border/50">
          <span />
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Problem</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Path</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Difficulty</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Status</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Concept</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase text-right">Time</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No problems match your filters.
          </div>
        ) : (
          filtered.map((p) => (
            <Link
              key={`${p.pathId}-${p.id}`}
              href={`/challenge/${p.pathId}/${p.id}`}
              className="w-full grid grid-cols-[32px_1fr_120px_80px_80px_140px_60px] items-center px-3 py-2.5 hover:bg-secondary/40 transition-colors border-b border-border/30 last:border-0 group"
            >
              <span>{statusIcon[p.status]}</span>
              <span className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate pr-3">
                {p.title}
              </span>
              <span className="text-xs text-muted-foreground truncate">{p.pathTitle}</span>
              <Badge variant="outline" className={`text-[10px] w-fit ${difficultyBadgeVariant[p.difficulty]}`}>
                {p.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">{p.status}</span>
              <span className="text-xs text-muted-foreground truncate">{p.concept}</span>
              <span className="text-xs text-muted-foreground text-right tabular-nums">{p.timeEstimate}</span>
            </Link>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {allProblems.length} problems
      </p>
    </main>
  );
}
