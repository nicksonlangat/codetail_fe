import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import type { Unit } from "@/lib/api/paths";

interface ContinueBannerProps {
  nextUnit: Unit | null;
  hasProblems: boolean;
  pathSlug: string;
}

export function ContinueBanner({ nextUnit, hasProblems, pathSlug }: ContinueBannerProps) {
  if (!hasProblems) return null;

  if (!nextUnit) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-brand-success/8 border border-brand-success/30 px-5 py-4 mt-6">
        <PartyPopper className="size-5 text-brand-success shrink-0" />
        <p className="text-[13px] text-brand-text">
          Every problem in this path is solved. Nice work.
        </p>
      </div>
    );
  }

  return (
    <Link
      href={`/paths/${pathSlug}/${nextUnit.unit}`}
      className="flex items-center justify-between gap-4 rounded-xl bg-brand-primary-tint border border-brand-primary/30 px-5 py-4 mt-6 cursor-pointer outline-none transition-all duration-500 hover:border-brand-primary/60"
    >
      <div>
        <p className="text-[11px] uppercase tracking-wider font-medium text-brand-primary mb-0.5">
          Continue where you left off
        </p>
        <p className="text-sm font-medium text-brand-text">{nextUnit.label}</p>
      </div>
      <span className="flex items-center gap-1.5 text-sm font-medium text-brand-primary shrink-0">
        Resume <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
