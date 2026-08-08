"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import React from "react";
import {
  Coins, Award, Trophy, BookOpen, FileText, ArrowRight,
  ClipboardCheck, Rocket, Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { StreakCard } from "@/components/dashboard/streak-card";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { StackTile } from "@/components/dashboard/stack-tile";
import { useAuthStore } from "@/stores/auth-store";
import { getRank } from "@/lib/api/auth";
import { getWeeklyLeaderboard } from "@/lib/api/leaderboard";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const BADGE_PRIORITY = [
  { id: "first-blood",  name: "First Blood",   hint: "Solve your first problem" },
  { id: "unit-clear",   name: "Unit Clear",     hint: "Complete all problems in a unit" },
  { id: "debugger",     name: "Debugger",       hint: "Solve 5 fix-the-bug problems" },
  { id: "hard-mode",    name: "Hard Mode",      hint: "Solve 5 hard problems" },
  { id: "week-warrior", name: "Week Warrior",   hint: "Maintain a 7-day streak" },
  { id: "the-50",       name: "The 50",         hint: "Solve 50 problems total" },
  { id: "path-blazer",  name: "Path Blazer",    hint: "Complete a full learning path" },
  { id: "pythonista",   name: "Pythonista",     hint: "Complete the Python path" },
  { id: "django-dev",   name: "Django Dev",     hint: "Complete the Django path" },
];

function getNextBadge(earned: string[]) {
  return BADGE_PRIORITY.find((b) => !earned.includes(b.id)) ?? null;
}



const COMING_SOON_PATHS = [
  { stack: "fastapi", title: "FastAPI: Building Production APIs" },
  { stack: "go", title: "Go: Systems Programming and Concurrency" },
  { stack: "typescript", title: "TypeScript: Type-Safe Development" },
  { stack: "sql", title: "SQL: Data Querying and Analytics" },
];

async function getDashboardPaths() {
  const { getPaths, getPathUnits } = await import("@/lib/api/paths");
  const paths = await getPaths();
  const unitsPerPath = await Promise.all(paths.map((p) => getPathUnits(p.slug)));
  return paths.map((path, i) => {
    const units = unitsPerPath[i];
    const totalSolved = units.reduce((sum, u) => sum + u.solved, 0);
    const completion = path.problem_count > 0 ? Math.round((totalSolved / path.problem_count) * 100) : null;
    return { path, units, unitCount: units.length, totalSolved, completion };
  });
}

function RadialProgress({ value }: { value: number }) {
  const r = 8;
  const c = 2 * Math.PI * r;
  return (
    <span className="flex items-center gap-1.5">
      <svg width="20" height="20" className="-rotate-90 shrink-0">
        <circle cx="10" cy="10" r={r} fill="none" stroke="var(--brand-surface)" strokeWidth="3" />
        <circle
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="3"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-brand-text font-medium">{value}%</span>
    </span>
  );
}

function SidebarStat({ icon: Icon, value, label }: { icon: React.ElementType; value: number | string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={SP}
      className="border border-brand-border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-500 hover:bg-brand-surface/60"
    >
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
          <Icon className="size-4 text-brand-text" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none text-brand-text">{value}</p>
          <p className="text-xs text-brand-text-muted">{label}</p>
        </div>
      </div>
      <ArrowRight className="size-4 text-brand-text-subtle" />
    </motion.div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info className="size-3.5 text-brand-text-subtle cursor-default" />
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={SP}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 w-52 px-3 py-2 rounded-lg bg-brand-text text-white text-[11px] leading-snug pointer-events-none shadow-lg"
          >
            {text}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-text" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function SectionHeader({ title, tooltip, showViewAll = true }: { title: string; tooltip?: string; showViewAll?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        <h2 className="font-semibold text-[15px] text-brand-text">{title}</h2>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      {showViewAll && (
        <a
          href="#"
          className="text-sm font-medium text-brand-primary underline cursor-pointer transition-all duration-500 hover:text-brand-primary-hover"
        >
          View all
        </a>
      )}
    </div>
  );
}

interface Nudge {
  tag: string;
  tagColor: string;
  title: string;
  message: string;
  cta: string;
  href: string;
}

function getNudge(
  problemsSolved: number,
  streak: number,
  activeToday: boolean,
  xpToday: number,
  nextBadge: { name: string; hint: string } | null,
): Nudge {
  if (problemsSolved === 0) {
    return {
      tag: "Get started",
      tagColor: "bg-brand-primary text-white",
      title: "Your first problem is waiting.",
      message: "Solve it, get AI feedback like a senior dev would give, and earn your first badge. Takes 5 minutes.",
      cta: "Solve your first problem",
      href: "/paths",
    };
  }
  if (streak > 0 && !activeToday) {
    return {
      tag: "Streak at risk",
      tagColor: "bg-brand-warning text-white",
      title: `Your ${streak}-day streak is on the line.`,
      message: "You haven't solved anything today. One problem is all it takes to keep it alive.",
      cta: "Solve now",
      href: "/paths",
    };
  }
  if (xpToday > 0 && nextBadge) {
    return {
      tag: "On a roll",
      tagColor: "bg-brand-success text-white",
      title: `${xpToday} XP earned today.`,
      message: `Next milestone: ${nextBadge.name}. ${nextBadge.hint}.`,
      cta: "Keep going",
      href: "/paths",
    };
  }
  if (nextBadge) {
    return {
      tag: "Next milestone",
      tagColor: "bg-brand-primary text-white",
      title: `Earn the ${nextBadge.name} badge.`,
      message: nextBadge.hint + ". Jump into a path and make progress toward it today.",
      cta: "Start now",
      href: "/paths",
    };
  }
  return {
    tag: "All badges earned",
    tagColor: "bg-brand-warning text-white",
    title: "You've earned every badge.",
    message: "You're at the top. Keep solving to hold your place on the leaderboard.",
    cta: "View leaderboard",
    href: "/paths",
  };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getSubtitle() {
  const h = new Date().getHours();
  if (h < 12) return "Start strong today.";
  if (h < 18) return "Pick up where you left off.";
  return "One more before you call it a day.";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const greeting = getGreeting();
  const subtitle = getSubtitle();
  const date = getFormattedDate();
  const nextBadge = getNextBadge(user?.badges ?? []);

  const { data: rank } = useQuery({
    queryKey: ["rank"],
    queryFn: getRank,
    staleTime: 60_000,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard-weekly"],
    queryFn: getWeeklyLeaderboard,
    staleTime: 60_000,
  });

  const { data: dashboardPaths = [] } = useQuery({
    queryKey: ["dashboard-paths"],
    queryFn: getDashboardPaths,
    staleTime: 60_000,
  });

  const nudge = useMemo(() => {
    const todayWeekday = (new Date().getDay() + 6) % 7;
    const activeToday = rank?.active_days?.includes(todayWeekday) ?? false;
    return getNudge(
      rank?.problems_solved ?? 0,
      user?.streak_days ?? 0,
      activeToday,
      rank?.xp_today ?? 0,
      nextBadge,
    );
  }, [rank, user, nextBadge]);

  const featuredUnits = useMemo(() => {
    const all: { path: (typeof dashboardPaths)[0]["path"]; unit: (typeof dashboardPaths)[0]["units"][0] }[] = [];
    for (const { path, units } of dashboardPaths) {
      for (const unit of units) all.push({ path, unit });
    }
    return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [dashboardPaths]);

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <div className="flex items-start justify-between mb-8 gap-6">
        <div>
          <p className="text-[11px] text-brand-text-subtle font-mono mb-1.5">{date}</p>
          <h1 className="text-[28px] font-bold flex items-center gap-2 text-brand-text">
            {greeting}, {firstName} <span>👋</span>
          </h1>
          <p className="text-brand-text-muted mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="flex items-center gap-3 border border-brand-border rounded-xl px-5 py-3">
            <div className="size-9 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
              <Coins className="size-4 text-brand-warning" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-brand-text">{user?.xp ?? 0}</p>
              <p className="text-xs text-brand-text-muted whitespace-nowrap">XP Points</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-brand-border rounded-xl px-5 py-3">
            <div className="size-9 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
              <Award className="size-4 text-brand-warning" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-brand-text">{user?.badges.length ?? 0}</p>
              <p className="text-xs text-brand-text-muted whitespace-nowrap">Badges</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-brand-border rounded-xl px-5 py-3">
            <div className="size-9 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
              <Trophy className="size-4 text-brand-warning" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-brand-text">
                {nextBadge ? nextBadge.name : "All earned!"}
              </p>
              <p className="text-xs text-brand-text-muted whitespace-nowrap">
                {nextBadge ? nextBadge.hint : "You got them all"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-primary-tint border border-brand-primary/40 rounded-2xl px-6 py-5 mb-8 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${nudge.tagColor}`}>
              {nudge.tag}
            </span>
            <p className="font-bold text-[15px] text-brand-text">{nudge.title}</p>
          </div>
          <p className="text-sm text-brand-text-muted">{nudge.message}</p>
        </div>
        <Link href={nudge.href} className="shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SP}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-text text-white cursor-pointer transition-all duration-500 hover:bg-brand-text/90 whitespace-nowrap"
          >
            {nudge.cta}
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-4 lg:col-span-3 space-y-8">
          <section>
            <SectionHeader title="Your learning paths" tooltip="Structured paths covering Python, Django, and more. Each path is made up of units you work through at your own pace." />
            <div className="border border-brand-border rounded-xl divide-y divide-brand-border">
              {dashboardPaths.length === 0 && (
                <div className="px-4 py-6 text-sm text-brand-text-muted text-center">No learning paths available yet.</div>
              )}
              {dashboardPaths.map(({ path, unitCount, completion }) => {
                const cta = completion === null || completion === 0 ? "Start" : "Continue";
                return (
                  <div key={path.slug} className="flex items-center gap-4 px-4 py-3 flex-wrap sm:flex-nowrap">
                    <div className="size-11 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
                      <StackTile stack={path.stack} className="size-8 text-[11px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-muted mb-0.5">
                        <BookOpen className="size-3" /> Path
                      </span>
                      <p className="font-semibold text-sm truncate text-brand-text">{path.title}</p>
                    </div>
                    <div className="w-24 text-xs shrink-0">
                      <p className="text-[10px] text-brand-text-subtle mb-1">Units</p>
                      <p className="flex items-center gap-1 text-brand-text">
                        <FileText className="size-3" /> {unitCount} {unitCount === 1 ? "unit" : "units"}
                      </p>
                    </div>
                    <div className="w-20 text-xs shrink-0">
                      <p className="text-[10px] text-brand-text-subtle mb-1">Completion</p>
                      {completion === null || completion === 0 ? (
                        <p className="text-brand-text-subtle">-</p>
                      ) : (
                        <RadialProgress value={completion} />
                      )}
                    </div>
                    <div className="w-20 text-xs shrink-0">
                      <p className="text-[10px] text-brand-text-subtle mb-1">Problems</p>
                      <p className="flex items-center gap-1 text-brand-text">
                        <ClipboardCheck className="size-3" /> {path.problem_count}
                      </p>
                    </div>
                    <Link href={`/paths/${path.slug}`}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={SP}
                        className={`text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 shrink-0 ${
                          cta === "Continue"
                            ? "bg-brand-text text-white hover:bg-brand-text/90"
                            : "border border-brand-border hover:bg-brand-surface text-brand-text"
                        }`}
                      >
                        {cta}
                      </motion.button>
                    </Link>
                  </div>
                );
              })}
              {COMING_SOON_PATHS.map((stub) => (
                <div key={stub.stack} className="flex items-center gap-4 px-4 py-3 flex-wrap sm:flex-nowrap opacity-50">
                  <div className="size-11 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
                    <StackTile stack={stub.stack} className="size-8 text-[11px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-muted mb-0.5">
                      <BookOpen className="size-3" /> Path
                    </span>
                    <p className="font-semibold text-sm truncate text-brand-text">{stub.title}</p>
                  </div>
                  <div className="w-24 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Units</p>
                    <p className="text-brand-text-subtle">-</p>
                  </div>
                  <div className="w-20 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Completion</p>
                    <p className="text-brand-text-subtle">-</p>
                  </div>
                  <div className="w-20 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Problems</p>
                    <p className="text-brand-text-subtle">-</p>
                  </div>
                  <span className="text-[10px] font-medium px-3 py-1.5 rounded-lg border border-brand-border text-brand-text-muted shrink-0">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Featured units" tooltip="A selection of units picked from across your learning paths. Jump in anywhere to keep momentum going." />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredUnits.map(({ path, unit }) => {
                const completion = unit.total > 0 ? Math.round((unit.solved / unit.total) * 100) : 0;
                const status = unit.solved === 0 ? "Not started" : completion === 100 ? "Completed" : "In progress";
                return (
                  <Link key={`${path.slug}-${unit.unit}`} href={`/paths/${path.slug}/${unit.unit}`} className="block">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={SP}
                    className="border border-brand-border rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
                  >
                    <div className="h-28 relative bg-brand-surface flex items-center justify-center">
                      <StackTile stack={path.stack} className="size-10 text-sm" iconSize={40} />
                      <span className="absolute top-2 left-2 bg-brand-text/70 text-white text-[10px] px-2 py-0.5 rounded-md">
                        {unit.total} {unit.total === 1 ? "problem" : "problems"}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-muted mb-1">
                        <BookOpen className="size-3" /> {path.title}
                      </span>
                      <p className="font-semibold text-sm leading-snug mb-1 text-brand-text">
                        {unit.label}
                      </p>
                      {unit.description && (
                        <p className="text-[11px] text-brand-text-muted leading-snug mb-2 line-clamp-2">
                          {unit.description}
                        </p>
                      )}
                      <div className="flex gap-1.5 mb-2">
                        <span className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md capitalize">
                          {path.stack}
                        </span>
                        <span className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md capitalize">
                          {path.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-subtle">{status}</p>
                    </div>
                  </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="col-span-4 lg:col-span-1 space-y-4">
          <SidebarStat icon={ClipboardCheck} value={rank?.problems_solved ?? 0} label="Problems solved" />

          <div className="border border-brand-border rounded-xl p-4">
            <p className="font-semibold text-sm text-brand-text mb-3">Leaderboard</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-text-subtle w-5 shrink-0">
                {leaderboard?.your_rank ? `#${leaderboard.your_rank}` : "—"}
              </span>
              <div className="size-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-brand-text">{user?.name}</p>
                <p className="text-[11px] text-brand-text-subtle capitalize">{user?.tier} · this week</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded-full shrink-0">
                <span className="size-1.5 rounded-full bg-brand-warning" />
                {leaderboard?.your_xp_week ?? 0} XP
              </span>
            </div>
            {!leaderboard?.your_rank && (
              <p className="text-[11px] text-brand-text-subtle mt-3">Solve a problem today to get ranked.</p>
            )}
          </div>

          <StreakCard streakDays={user?.streak_days ?? 0} activeDays={rank?.active_days ?? []} />
          <HeatmapCard />

          <div className="border border-brand-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <h3 className="font-semibold text-sm text-brand-text">Goals</h3>
              <InfoTooltip text="Your daily problem-solving target. Consistent practice is the fastest way to level up." />
            </div>
            <div className="flex justify-center mb-3">
              <div className="relative size-20">
                <svg viewBox="0 0 80 80" className="-rotate-90 size-20">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--brand-surface)" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="var(--brand-primary)"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - 0.2)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Rocket className="size-6 text-brand-primary" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm mb-3 text-brand-text">
              Daily Goal: <span className="font-bold">6/30</span> problems
            </p>
            <div className="border-t border-brand-border pt-3 text-center">
              <p className="text-xs text-brand-text-muted">
                Current streak: <span className="font-semibold text-brand-text">{user?.streak_days ?? 0} {(user?.streak_days ?? 0) === 1 ? "day" : "days"}</span>
              </p>
              <a
                href="#"
                className="text-xs font-medium text-brand-primary underline mt-1 inline-block cursor-pointer transition-all duration-500 hover:text-brand-primary-hover"
              >
                See Detail
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
