import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Unit } from "@/lib/api/paths";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

type UnitState = "not_started" | "in_progress" | "completed";

const STATE_STYLES: Record<UnitState, string> = {
  not_started: "border-brand-border-strong",
  in_progress: "border-brand-primary/60 bg-brand-primary/5",
  completed: "border-brand-success/60 bg-brand-success/5",
};

export function unitState(unit: Unit): UnitState {
  if (unit.total === 0 || unit.solved === 0) return "not_started";
  if (unit.solved >= unit.total) return "completed";
  return "in_progress";
}

export function UnitCard({ unit, pathSlug }: { unit: Unit; pathSlug: string }) {
  const state = unitState(unit);
  const pct = unit.total > 0 ? Math.round((unit.solved / unit.total) * 100) : 0;

  return (
    <Link href={`/paths/${pathSlug}/${unit.unit}`} className="block">
      <motion.div
        whileHover={{ y: -1 }}
        transition={SP}
        className={`border rounded-xl bg-white p-4 cursor-pointer transition-all duration-500 hover:border-brand-primary ${STATE_STYLES[state]}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-brand-text leading-snug">{unit.label}</h3>
          {state === "completed" && (
            <span className="size-5 rounded-full bg-brand-success/15 flex items-center justify-center shrink-0">
              <Check className="size-3 text-brand-success" strokeWidth={3} />
            </span>
          )}
        </div>

        {unit.description && (
          <p className="text-[12px] text-brand-text-muted leading-relaxed mb-3 line-clamp-2">
            {unit.description}
          </p>
        )}

        <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-brand-text-subtle">
          {unit.solved}/{unit.total} solved
        </p>
      </motion.div>
    </Link>
  );
}
