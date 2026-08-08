"use client";

import { useMemo, useState } from "react";
import { Route } from "lucide-react";
import { PathCard } from "@/components/paths/path-card";
import { PathCardSkeleton } from "@/components/paths/path-card-skeleton";
import { usePaths, useDashboard } from "@/lib/queries/use-paths";
import { getErrorMessage } from "@/lib/api/client";
import type { Stack } from "@/lib/api/types";

const STACK_FILTERS: { id: Stack | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "python", label: "Python" },
  { id: "django", label: "Django" },
  { id: "fastapi", label: "FastAPI" },
  { id: "sql", label: "SQL" },
  { id: "go", label: "Go" },
];

export default function PathsPage() {
  const [stackFilter, setStackFilter] = useState<Stack | "all">("all");

  const { data: paths, isLoading, isError, error } = usePaths(
    stackFilter === "all" ? undefined : stackFilter
  );
  const { data: dashboard } = useDashboard();

  const progressByPathId = useMemo(() => {
    return new Map(dashboard?.active_paths.map((p) => [p.path_id, p]));
  }, [dashboard]);

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-brand-text">Learning Paths</h1>
        <p className="text-brand-text-muted mt-1 text-sm">
          Pick a stack and work through it problem by problem.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {STACK_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStackFilter(f.id)}
            className={`text-sm font-medium px-3.5 py-1.5 rounded-lg cursor-pointer outline-none transition-all duration-500 ${
              stackFilter === f.id
                ? "bg-brand-text text-white"
                : "border border-brand-border-strong text-brand-text-muted hover:bg-brand-surface"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <PathCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <p className="text-sm text-brand-text-muted">
            {getErrorMessage(error, "Couldn't load paths right now.")}
          </p>
        </div>
      )}

      {!isLoading && !isError && paths && paths.length === 0 && (
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <Route className="size-8 text-brand-text-subtle mx-auto mb-3" />
          <p className="text-sm text-brand-text-muted">No paths match this filter yet.</p>
        </div>
      )}

      {!isLoading && !isError && paths && paths.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} progress={progressByPathId.get(path.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
