import { Flame } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface StreakCardProps {
  streakDays: number;
  activeDays: number[];
}

export function StreakCard({ streakDays, activeDays }: StreakCardProps) {
  const activeSet = new Set(activeDays);

  return (
    <div className="border border-brand-border rounded-xl p-4">
      <h3 className="font-semibold text-sm text-brand-text mb-3">Streak</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
          <Flame className="size-5 text-brand-warning" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none text-brand-text">
            {streakDays}{" "}
            <span className="text-xs font-normal text-brand-text-muted">
              {streakDays === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="text-xs text-brand-text-muted">Current streak</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`size-5 rounded-md transition-colors duration-300 ${
                activeSet.has(i)
                  ? "bg-brand-primary"
                  : "bg-brand-surface"
              }`}
            />
            <span className="text-[9px] text-brand-text-subtle">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
