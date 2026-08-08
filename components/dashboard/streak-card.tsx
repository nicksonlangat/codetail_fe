import { Info, Flame, TrendingUp } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_ACTIVITY = [true, true, true, false, true, true, false];

export function StreakCard() {
  return (
    <div className="border border-brand-border rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="font-semibold text-sm text-brand-text">Streak</h3>
        <Info className="size-3.5 text-brand-text-subtle" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
          <Flame className="size-5 text-brand-warning" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none text-brand-text">
            12 <span className="text-xs font-normal text-brand-text-muted">days</span>
          </p>
          <p className="text-xs text-brand-text-muted">Current streak</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`size-5 rounded-md flex items-center justify-center text-[9px] font-medium ${
                WEEK_ACTIVITY[i] ? "bg-brand-primary text-white" : "bg-brand-surface text-brand-text-subtle"
              }`}
            />
            <span className="text-[9px] text-brand-text-subtle">{d}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-brand-text-muted pt-3 border-t border-brand-border">
        <TrendingUp className="size-3" />
        <span>
          Longest: <span className="font-semibold text-brand-text">18 days</span>
        </span>
      </div>
    </div>
  );
}
