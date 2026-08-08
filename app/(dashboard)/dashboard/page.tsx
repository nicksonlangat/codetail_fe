"use client";

import { motion } from "framer-motion";
import {
  Coins, Award, Trophy, BookOpen, FileText, Clock, ArrowRight,
  ClipboardCheck, Rocket, Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

const IN_PROGRESS = [
  { stack: "python", title: "Mastering Python: Data Structures Deep Dive", content: "5 Problems", completion: null as number | null, deadline: "1 Day", urgent: false, cta: "Start" },
  { stack: "django", title: "Django ORM Advanced Query Patterns", content: "12 Problems", completion: 64, deadline: "12 hrs", urgent: true, cta: "Continue" },
];

const ENROLLMENTS = [
  { stack: "python", materials: "10 Problems", title: "Deliberate Practice: Advanced Python Patterns", tags: ["Python", "Not Urgent"] },
  { stack: "sql", materials: "5 Problems", title: "SQL Window Functions for Data Analysts", tags: ["SQL", "Not Urgent"] },
  { stack: "django", materials: "12 Problems", title: "Mastering Django for Scalable APIs", tags: ["Django", "Not Urgent"] },
];

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

function SidebarStat({ icon: Icon, value, label }: { icon: typeof Clock; value: number | string; label: string }) {
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

function SectionHeader({ title, showViewAll = true }: { title: string; showViewAll?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        <h2 className="font-semibold text-[15px] text-brand-text">{title}</h2>
        <Info className="size-3.5 text-brand-text-subtle" />
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

      <div className="bg-brand-primary-tint rounded-2xl px-6 py-5 mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-brand-primary text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            New
          </span>
          <p className="font-bold text-[15px] text-brand-text">Feature Discussion</p>
        </div>
        <p className="text-sm text-brand-text">
          The learning content area now includes an AI chat that can explain any problem in real
          time.{" "}
          <a
            href="#"
            className="underline font-medium text-brand-primary cursor-pointer transition-all duration-500 hover:text-brand-primary-hover"
          >
            Go to detail →
          </a>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-4 lg:col-span-3 space-y-8">
          <section>
            <SectionHeader title="In progress learning content" />
            <div className="border border-brand-border rounded-xl divide-y divide-brand-border">
              {IN_PROGRESS.map((row) => (
                <div key={row.title} className="flex items-center gap-4 px-4 py-3 flex-wrap sm:flex-nowrap">
                  <div className="size-11 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
                    <StackTile stack={row.stack} className="size-8 text-[11px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-muted mb-0.5">
                      <BookOpen className="size-3" /> Path
                    </span>
                    <p className="font-semibold text-sm truncate text-brand-text">{row.title}</p>
                  </div>
                  <div className="w-24 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Content</p>
                    <p className="flex items-center gap-1 text-brand-text">
                      <FileText className="size-3" /> {row.content}
                    </p>
                  </div>
                  <div className="w-20 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Completion</p>
                    {row.completion === null ? (
                      <p className="text-brand-text-subtle">-</p>
                    ) : (
                      <RadialProgress value={row.completion} />
                    )}
                  </div>
                  <div className="w-20 text-xs shrink-0">
                    <p className="text-[10px] text-brand-text-subtle mb-1">Deadline</p>
                    <p
                      className={`flex items-center gap-1 ${
                        row.urgent ? "text-brand-destructive font-medium" : "text-brand-text"
                      }`}
                    >
                      <Clock className="size-3" /> {row.deadline}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={SP}
                    className={`text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 shrink-0 ${
                      row.cta === "Continue"
                        ? "bg-brand-text text-white hover:bg-brand-text/90"
                        : "border border-brand-border hover:bg-brand-surface text-brand-text"
                    }`}
                  >
                    {row.cta}
                  </motion.button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="New enrollment" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ENROLLMENTS.map((c) => (
                <motion.div
                  key={c.title}
                  whileHover={{ y: -2 }}
                  transition={SP}
                  className="border border-brand-border rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
                >
                  <div className="h-28 relative bg-brand-surface flex items-center justify-center">
                    <StackTile stack={c.stack} className="size-10 text-sm" />
                    <span className="absolute top-2 left-2 bg-brand-text/70 text-white text-[10px] px-2 py-0.5 rounded-md">
                      {c.materials}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-muted mb-1">
                      <BookOpen className="size-3" /> Path
                    </span>
                    <p className="font-semibold text-sm leading-snug mb-2 h-10 text-brand-text">
                      {c.title}
                    </p>
                    <div className="flex gap-1.5 mb-2">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-brand-text-subtle">Not Started</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="h-1 bg-brand-surface rounded-full mt-4 w-full">
              <div className="h-1 bg-brand-text-subtle rounded-full w-1/4" />
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
              <Info className="size-3.5 text-brand-text-subtle" />
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
