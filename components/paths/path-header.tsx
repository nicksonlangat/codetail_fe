import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";
import { StackIcon } from "./stack-icon";
import { DIFFICULTY_STYLES } from "./constants";
import type { Path } from "@/lib/api/paths";

interface PathHeaderProps {
  path: Path;
  solved: number;
  total: number;
}

export function PathHeader({ path, solved, total }: PathHeaderProps) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div>
      <Link
        href="/paths"
        className="inline-flex items-center gap-1.5 text-[12px] text-brand-text-muted cursor-pointer outline-none transition-all duration-500 hover:text-brand-text mb-4"
      >
        <ArrowLeft className="size-3.5" />
        All paths
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 border border-brand-border-strong rounded-xl bg-white p-6">
        <div className="flex items-start gap-4 min-w-0">
          <div className="size-14 rounded-xl bg-brand-surface flex items-center justify-center shrink-0">
            <StackIcon stack={path.stack} className="size-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h1 className="text-xl font-bold text-brand-text">{path.title}</h1>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md capitalize ${DIFFICULTY_STYLES[path.difficulty]}`}
              >
                {path.difficulty}
              </span>
            </div>
            <p className="text-[13px] text-brand-text-muted leading-relaxed max-w-lg">
              {path.description}
            </p>
            {path.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {path.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center shrink-0">
          <div className="relative size-16">
            <RingProgress value={pct} size={64} stroke={5} inView />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-text">
              {pct}%
            </span>
          </div>
          <p className="text-[11px] text-brand-text-subtle mt-2 whitespace-nowrap">
            {solved}/{total} solved
          </p>
        </div>
      </div>
    </div>
  );
}
