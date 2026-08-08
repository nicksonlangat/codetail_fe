import Link from "next/link";
import { Flame, LogIn, Trophy, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRank, useWeeklyLeaderboard } from "@/lib/queries/use-user";

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="size-7 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
        <Icon className="size-3.5 text-brand-text-muted" />
      </span>
      <span className="text-xs text-brand-text-muted flex-1">{label}</span>
      <span className="text-sm font-semibold text-brand-text tabular-nums">{value}</span>
    </div>
  );
}

function RankCardSkeleton() {
  return (
    <div className="border border-brand-border-strong rounded-xl p-4 bg-white animate-pulse space-y-3">
      <div className="h-4 w-24 rounded bg-brand-surface" />
      <div className="h-7 w-full rounded bg-brand-surface" />
      <div className="h-7 w-full rounded bg-brand-surface" />
      <div className="h-7 w-full rounded bg-brand-surface" />
    </div>
  );
}

export function RankCard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: rank, isLoading: rankLoading } = useRank();
  const { data: leaderboard, isLoading: leaderboardLoading } = useWeeklyLeaderboard();

  if (!isAuthenticated) {
    return (
      <div className="border border-brand-border-strong rounded-xl p-4 bg-white text-center">
        <span className="size-9 rounded-lg bg-brand-primary/10 flex items-center justify-center mx-auto mb-2.5">
          <Trophy className="size-4 text-brand-primary" />
        </span>
        <p className="text-[13px] font-medium text-brand-text mb-1">Track your rank</p>
        <p className="text-[11px] text-brand-text-muted mb-3 leading-relaxed">
          Sign in to see your weekly rank, streak, and XP.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover"
        >
          <LogIn className="size-3.5" />
          Sign in
        </Link>
      </div>
    );
  }

  if (rankLoading || leaderboardLoading) {
    return <RankCardSkeleton />;
  }

  return (
    <div className="border border-brand-border-strong rounded-xl p-4 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <span className="size-6 rounded-md bg-brand-warning/10 flex items-center justify-center shrink-0">
          <Trophy className="size-3.5 text-brand-warning" />
        </span>
        <h3 className="font-semibold text-sm text-brand-text">Your rank</h3>
      </div>
      <p className="text-[11px] text-brand-text-subtle mb-4 ml-8">This week, across all paths</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
          <span className="text-base font-bold text-brand-primary">
            {leaderboard?.your_rank ? `#${leaderboard.your_rank}` : "—"}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text leading-none">
            {leaderboard?.your_rank ? "Ranked" : "Not ranked yet"}
          </p>
          <p className="text-xs text-brand-text-muted mt-1">
            {leaderboard?.your_rank ? "Top 20 this week" : "Solve a problem to get ranked"}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-brand-border-strong">
        <StatRow icon={Zap} label="XP this week" value={leaderboard?.your_xp_week ?? 0} />
        <StatRow icon={Flame} label="Current streak" value={`${rank?.streak_days ?? 0}d`} />
        <StatRow icon={Trophy} label="Problems solved" value={rank?.problems_solved ?? 0} />
      </div>
    </div>
  );
}
