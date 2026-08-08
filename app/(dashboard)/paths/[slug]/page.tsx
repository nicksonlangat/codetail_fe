"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PathHeader } from "@/components/paths/path-header";
import { PathHeaderSkeleton } from "@/components/paths/path-header-skeleton";
import { ContinueBanner } from "@/components/paths/continue-banner";
import { UnitCard, unitState } from "@/components/paths/unit-card";
import { UnitCardSkeleton } from "@/components/paths/unit-card-skeleton";
import { usePath, usePathUnits } from "@/lib/queries/use-paths";
import { getErrorMessage } from "@/lib/api/client";

export default function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: path, isLoading: pathLoading, isError, error } = usePath(slug);
  const { data: units, isLoading: unitsLoading } = usePathUnits(slug);

  const sortedUnits = useMemo(
    () => [...(units ?? [])].sort((a, b) => a.unit_sort_order - b.unit_sort_order),
    [units]
  );

  const { solved, total } = useMemo(
    () =>
      sortedUnits.reduce(
        (acc, u) => ({ solved: acc.solved + u.solved, total: acc.total + u.total }),
        { solved: 0, total: 0 }
      ),
    [sortedUnits]
  );

  const nextUnit = useMemo(
    () => sortedUnits.find((u) => unitState(u) !== "completed") ?? null,
    [sortedUnits]
  );

  if (isError) {
    return (
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <p className="text-sm text-brand-text-muted mb-3">
            {getErrorMessage(error, "Couldn't find this path.")}
          </p>
          <Link
            href="/paths"
            className="text-sm font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover"
          >
            Back to all paths
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      {pathLoading || !path ? (
        <PathHeaderSkeleton />
      ) : (
        <>
          <PathHeader path={path} solved={solved} total={total} />
          <ContinueBanner nextUnit={nextUnit} hasProblems={total > 0} pathSlug={slug} />
        </>
      )}

      <h2 className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider mt-8 mb-3">
        Units
      </h2>

      {unitsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <UnitCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedUnits.length === 0 ? (
        <div className="border border-brand-border-strong rounded-xl py-16 text-center">
          <p className="text-sm text-brand-text-muted">No units in this path yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUnits.map((unit) => (
            <UnitCard key={unit.unit} unit={unit} pathSlug={slug} />
          ))}
        </div>
      )}
    </div>
  );
}
