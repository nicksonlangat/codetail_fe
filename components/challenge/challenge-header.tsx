import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChallengeHeaderProps {
  pathSlug: string;
  pathTitle: string;
  unitSlug: string;
  unitLabel: string;
  problemTitle: string;
  index: number;
  total: number;
  prevProblemId: string | null;
  nextProblemId: string | null;
}

export function ChallengeHeader({
  pathSlug,
  pathTitle,
  unitSlug,
  unitLabel,
  problemTitle,
  index,
  total,
  prevProblemId,
  nextProblemId,
}: ChallengeHeaderProps) {
  const problemHref = (id: string) => `/paths/${pathSlug}/${unitSlug}/${id}`;

  return (
    <div className="flex items-center justify-between h-14 px-5 border-b border-brand-border shrink-0">
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <Link
          href="/dashboard"
          className="font-semibold text-brand-text shrink-0 cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary"
        >
          Code<span className="text-brand-primary">tail</span>
        </Link>

        <ChevronRight className="size-3.5 text-brand-text-subtle shrink-0" />

        <Link
          href={`/paths/${pathSlug}`}
          className="text-brand-text-muted truncate cursor-pointer outline-none transition-all duration-500 hover:text-brand-text"
        >
          {pathTitle}
        </Link>

        <ChevronRight className="size-3.5 text-brand-text-subtle shrink-0" />

        <Link
          href={`/paths/${pathSlug}/${unitSlug}`}
          className="text-brand-text-muted truncate capitalize cursor-pointer outline-none transition-all duration-500 hover:text-brand-text"
        >
          {unitLabel}
        </Link>

        <ChevronRight className="size-3.5 text-brand-text-subtle shrink-0" />

        <span className="font-medium text-brand-text truncate">{problemTitle}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {prevProblemId ? (
          <Link
            href={problemHref(prevProblemId)}
            className="inline-flex items-center rounded-lg border border-brand-border-strong text-brand-text-muted text-xs font-medium px-2 py-1.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface"
          >
            <ChevronLeft className="size-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-brand-border text-brand-text-subtle/50 text-xs font-medium px-2 py-1.5">
            <ChevronLeft className="size-3.5" />
          </span>
        )}
        <span className="text-xs text-brand-text-subtle font-mono px-1 tabular-nums">
          {index} / {total}
        </span>
        {nextProblemId ? (
          <Link
            href={problemHref(nextProblemId)}
            className="inline-flex items-center gap-0.5 rounded-lg border border-brand-border-strong text-brand-text-muted text-xs font-medium px-2.5 py-1.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface"
          >
            Next <ChevronRight className="size-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-0.5 rounded-lg border border-brand-border text-brand-text-subtle/50 text-xs font-medium px-2.5 py-1.5">
            Next <ChevronRight className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
