import { Sparkles, Target } from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";
import { PROBLEM_DIFFICULTY_DOT, PROBLEM_TYPE_CONFIG } from "./constants";
import type { Problem, Unit } from "@/lib/api/paths";
import type { ProblemDifficulty, ProblemType } from "@/lib/api/types";

const DIFFICULTIES: ProblemDifficulty[] = ["easy", "medium", "hard"];
const TYPES: ProblemType[] = ["write_code", "fix_code", "mcq", "refactor"];

interface UnitStatsCardProps {
  unit: Unit | null;
  problems: Problem[];
}

export function UnitStatsCard({ unit, problems }: UnitStatsCardProps) {
  const pct = unit && unit.total > 0 ? Math.round((unit.solved / unit.total) * 100) : 0;
  const proCount = unit ? unit.total - unit.free : 0;

  const scored = problems.filter((p) => p.best_score != null && p.best_score > 0);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, p) => sum + (p.best_score ?? 0), 0) / scored.length)
    : null;

  return (
    <div className="border border-brand-border-strong rounded-xl p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="size-6 rounded-md bg-brand-primary/10 flex items-center justify-center shrink-0">
          <Target className="size-3.5 text-brand-primary" />
        </span>
        <h3 className="font-semibold text-sm text-brand-text">Unit stats</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative size-12 shrink-0">
          <RingProgress value={pct} size={48} stroke={4} inView />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-brand-text">
            {pct}%
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text leading-none">
            {unit?.solved ?? 0}
            <span className="text-brand-text-subtle font-normal"> / {unit?.total ?? 0}</span>
          </p>
          <p className="text-xs text-brand-text-muted mt-1">Problems solved</p>
        </div>
      </div>

      {avgScore != null && (
        <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-brand-border-strong">
          <span className="text-brand-text-muted">Average score</span>
          <span className="font-semibold text-brand-text tabular-nums">{avgScore}%</span>
        </div>
      )}

      <div className="space-y-1.5 mb-3">
        <p className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle mb-1.5">
          Difficulty mix
        </p>
        {DIFFICULTIES.map((d) => {
          const inUnit = problems.filter((p) => p.difficulty === d);
          if (inUnit.length === 0) return null;
          const solvedCount = inUnit.filter((p) => p.user_status === "solved").length;
          return (
            <div key={d} className="flex items-center gap-2 text-xs">
              <span className={`size-1.5 rounded-full shrink-0 ${PROBLEM_DIFFICULTY_DOT[d]}`} />
              <span className="text-brand-text-muted capitalize flex-1">{d}</span>
              <span className="text-brand-text-subtle tabular-nums">
                {solvedCount}/{inUnit.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5 pt-3 border-t border-brand-border-strong">
        <p className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle mb-1.5">
          Problem types
        </p>
        {TYPES.map((t) => {
          const inUnit = problems.filter((p) => p.type === t);
          if (inUnit.length === 0) return null;
          const config = PROBLEM_TYPE_CONFIG[t];
          return (
            <div key={t} className="flex items-center gap-2 text-xs">
              <config.icon className="size-3 text-brand-text-subtle shrink-0" />
              <span className="text-brand-text-muted flex-1">{config.label}</span>
              <span className="text-brand-text-subtle tabular-nums">{inUnit.length}</span>
            </div>
          );
        })}
      </div>

      {unit && proCount > 0 && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-brand-border-strong text-[11px] text-brand-text-subtle">
          <Sparkles className="size-3 text-brand-warning shrink-0" />
          {unit.free} free · {proCount} pro
        </div>
      )}
    </div>
  );
}
