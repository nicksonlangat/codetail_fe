"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";

const SqlJoinsGuide = dynamic(() => import("@/content/sql/joins"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 mt-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-brand-surface rounded animate-pulse" style={{ width: `${75 + (i % 3) * 10}%` }} />
      ))}
    </div>
  ),
});

const GUIDES: Record<string, ComponentType> = {
  "sql/joins": SqlJoinsGuide,
};

export function hasUnitGuide(pathSlug: string, unitSlug: string): boolean {
  return `${pathSlug}/${unitSlug}` in GUIDES;
}

export function UnitGuide({ pathSlug, unitSlug }: { pathSlug: string; unitSlug: string }) {
  const Guide = GUIDES[`${pathSlug}/${unitSlug}`];
  if (!Guide) return null;
  return (
    <div className="pb-12">
      <Guide />
    </div>
  );
}
