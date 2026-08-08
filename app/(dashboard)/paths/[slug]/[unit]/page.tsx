"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { ProblemRow } from "@/components/paths/problem-row";
import { ProblemRowSkeleton } from "@/components/paths/problem-row-skeleton";
import { SectionDivider } from "@/components/paths/section-divider";
import { UnlockProCard } from "@/components/paths/unlock-pro-card";
import { UnitStatsCard } from "@/components/paths/unit-stats-card";
import { RankCard } from "@/components/paths/rank-card";
import { RingProgress } from "@/components/ui/ring-progress";
import { usePath, usePathUnits, usePathProblems } from "@/lib/queries/use-paths";
import { getErrorMessage } from "@/lib/api/client";

const BACK_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };
const ROW_STAGGER_CAP = 0.3;

export default function UnitDetailPage() {
  const { slug, unit } = useParams<{ slug: string; unit: string }>();

  const { data: path } = usePath(slug);
  const { data: units } = usePathUnits(slug);
  const { data: problems, isLoading, isError, error } = usePathProblems(slug, unit);

  const sortedUnits = useMemo(
    () => [...(units ?? [])].sort((a, b) => a.unit_sort_order - b.unit_sort_order),
    [units]
  );
  const currentUnit = sortedUnits.find((u) => u.unit === unit) ?? null;
  const moduleNumber = sortedUnits.findIndex((u) => u.unit === unit) + 1;

  // The AI-generated bucket is its own feature (generation, deletion) not
  // built here yet — this page shows the curated problem set only.
  const curated = useMemo(
    () =>
      (problems ?? [])
        .filter((p) => !p.is_generated)
        .sort((a, b) => a.sort_order - b.sort_order),
    [problems]
  );

  const freeRows = curated.filter((p) => p.is_free && !p.locked);
  const proUnlockedRows = curated.filter((p) => !p.is_free && !p.locked);
  const lockedRows = curated.filter((p) => p.locked);

  const pct = currentUnit && currentUnit.total > 0
    ? Math.round((currentUnit.solved / currentUnit.total) * 100)
    : 0;

  const unitLabel = currentUnit?.label ?? unit.replace(/-/g, " ");

  if (isError) {
    return (
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <p className="text-sm text-brand-text-muted mb-3">
            {getErrorMessage(error, "Couldn't load this unit.")}
          </p>
          <Link
            href={`/paths/${slug}`}
            className="text-sm font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover"
          >
            Back to path
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={BACK_SPRING}>
        <Link
          href={`/paths/${slug}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-text-muted border border-brand-border-strong bg-white px-3 py-1.5 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:border-brand-primary/40 hover:text-brand-text hover:bg-brand-surface/50"
        >
          <ArrowLeft className="size-3.5" />
          {path?.title ?? "Path"}
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTRANCE, delay: 0.05 }}
        className="flex items-start justify-between gap-6 mt-5"
      >
        <div className="min-w-0">
          {moduleNumber > 0 && (
            <p className="text-[11px] font-semibold text-brand-primary tracking-widest uppercase mb-1.5">
              Module {String(moduleNumber).padStart(2, "0")}
              {path?.title && <span className="text-brand-text-subtle"> · {path.title}</span>}
            </p>
          )}
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-brand-text leading-tight capitalize">
            {unitLabel}
          </h1>
          {currentUnit?.description && (
            <p className="text-[13px] text-brand-text-muted leading-relaxed mt-2 max-w-lg">
              {currentUnit.description}
            </p>
          )}
        </div>

        {currentUnit && currentUnit.total > 0 && (
          <div className="flex flex-col items-center shrink-0">
            <div className="relative size-14">
              <RingProgress value={pct} size={56} stroke={4} inView />
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-brand-text">
                {pct}%
              </span>
            </div>
            <p className="text-[10px] text-brand-text-subtle mt-1.5 whitespace-nowrap">
              {currentUnit.solved}/{currentUnit.total} solved
            </p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="col-span-4 lg:col-span-3">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProblemRowSkeleton key={i} />
              ))}
            </div>
          ) : curated.length === 0 ? (
            <div className="border border-brand-border-strong rounded-xl py-16 text-center">
              <p className="text-sm text-brand-text-muted">No problems in this unit yet.</p>
            </div>
          ) : (
            <>
              {freeRows.length > 0 && (
                <div>
                  <SectionDivider label="Free" count={freeRows.length} marginTop="mt-0" />
                  <div className="space-y-2">
                    {freeRows.map((problem) => (
                      <ProblemRow
                        key={problem.id}
                        problem={problem}
                        pathSlug={slug}
                        unitSlug={unit}
                        index={curated.indexOf(problem)}
                        delay={Math.min(curated.indexOf(problem) * 0.03, ROW_STAGGER_CAP)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {lockedRows.length > 0 && (
                <div className="mt-5 first:mt-0">
                  <UnlockProCard count={lockedRows.length} unitLabel={unitLabel} />
                </div>
              )}

              {proUnlockedRows.length > 0 && (
                <div>
                  <SectionDivider
                    icon={Star}
                    label="Pro"
                    count={proUnlockedRows.length}
                    accent="warning"
                    marginTop="mt-2"
                  />
                  <div className="space-y-2">
                    {proUnlockedRows.map((problem) => (
                      <ProblemRow
                        key={problem.id}
                        problem={problem}
                        pathSlug={slug}
                        unitSlug={unit}
                        index={curated.indexOf(problem)}
                        delay={Math.min(curated.indexOf(problem) * 0.03, ROW_STAGGER_CAP)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {lockedRows.length > 0 && (
                <div>
                  <SectionDivider
                    icon={Star}
                    label="Pro"
                    count={lockedRows.length}
                    accent="warning"
                    marginTop="mt-2"
                  />
                  <div className="space-y-2">
                    {lockedRows.map((problem) => (
                      <ProblemRow
                        key={problem.id}
                        problem={problem}
                        pathSlug={slug}
                        unitSlug={unit}
                        index={curated.indexOf(problem)}
                        delay={Math.min(curated.indexOf(problem) * 0.03, ROW_STAGGER_CAP)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ENTRANCE, delay: 0.1 }}
          className="col-span-4 lg:col-span-1 space-y-4 lg:sticky lg:top-24 lg:self-start"
        >
          <UnitStatsCard unit={currentUnit} problems={curated} />
          <RankCard />
        </motion.div>
      </div>
    </div>
  );
}
