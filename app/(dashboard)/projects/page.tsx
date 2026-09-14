"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Hammer, Wrench, Search, Clock, ChevronRight,
  Zap, Box, Layers, Flame, CheckCircle2, Briefcase,
} from "lucide-react";
import { useProjects, useProjectStats } from "@/lib/queries/use-projects";
import type { ProjectStats, SuggestedNext } from "@/lib/api/projects";

type Mode   = "build" | "fix" | "debug";
type Tier   = "utility" | "component" | "system" | "incident";
type Status = "not_started" | "in_progress" | "completed";

const TIER_CONFIG: Record<Tier, { label: string; color: string; dot: string; icon: typeof Zap }> = {
  utility:   { label: "Utility",   color: "text-brand-success bg-brand-success/10 border-brand-success/20",             dot: "bg-brand-success",     icon: Zap    },
  component: { label: "Component", color: "text-brand-sky bg-brand-sky/10 border-brand-sky/20",                         dot: "bg-brand-sky",         icon: Box    },
  system:    { label: "System",    color: "text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/20",                         dot: "bg-[#7c3aed]",         icon: Layers },
  incident:  { label: "Incident",  color: "text-brand-destructive bg-brand-destructive/10 border-brand-destructive/20", dot: "bg-brand-destructive", icon: Flame  },
};

const MODE_CONFIG: Record<Mode, { label: string; icon: typeof Hammer; color: string }> = {
  build: { label: "Build", icon: Hammer, color: "text-brand-text-muted bg-brand-surface"        },
  fix:   { label: "Fix",   icon: Wrench, color: "text-brand-warning bg-brand-warning/10"         },
  debug: { label: "Debug", icon: Search, color: "text-brand-destructive bg-brand-destructive/10" },
};

const MODE_FILTERS: { id: Mode | "all"; label: string; icon?: typeof Hammer }[] = [
  { id: "all",   label: "All"   },
  { id: "build", label: "Build", icon: Hammer },
  { id: "fix",   label: "Fix",   icon: Wrench },
  { id: "debug", label: "Debug", icon: Search },
];

const TIER_FILTERS: { id: Tier | "all"; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "utility",   label: "Utility"   },
  { id: "component", label: "Component" },
  { id: "system",    label: "System"    },
  { id: "incident",  label: "Incident"  },
];

interface Project {
  id: string;
  ticket_id: string;
  repo: string;
  title: string;
  scenario: string;
  mode: Mode;
  tier: Tier;
  estimated_minutes: number;
  tags: string[];
  category: string;
  user_status?: Status | null;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    ticket_id: "PY-014",
    repo: "acme-api",
    title: "Phone Number Normalizer",
    scenario:
      "You're building the user registration pipeline for a Kenyan fintech. Users type their numbers in every format imaginable. Your job: write a normalizer that accepts the mess and produces clean E.164, or rejects at the boundary before anything hits the database.",
    mode: "build",
    tier: "utility",
    estimated_minutes: 15,
    tags: ["Python", "Regex", "E.164", "Input Validation"],
    category: "Input & Data Normalization",
  },
  {
    id: "2",
    ticket_id: "API-031",
    repo: "acme-api",
    title: "Retry Utility with Exponential Backoff",
    scenario:
      "You're integrating with a third-party geocoding API that drops requests under load. Rather than wrapping every call in ad-hoc try/except loops, you're building a shared retry() utility the whole team will use. It needs backoff, jitter, and a clear contract for which errors are worth retrying.",
    mode: "build",
    tier: "component",
    estimated_minutes: 30,
    tags: ["Python", "Backoff", "Jitter", "Error Handling"],
    category: "Production Utilities",
  },
  {
    id: "3",
    ticket_id: "SEC-007",
    repo: "acme-payments",
    title: "Webhook Signature Validator",
    scenario:
      "You're on the payments team. The endpoint that receives Paystack webhooks is wide open. Anyone who knows the URL can POST fake events and trigger order fulfillment. You're locking it down with HMAC signature validation and timestamp-based replay protection before this ships to production.",
    mode: "build",
    tier: "component",
    estimated_minutes: 35,
    tags: ["Django", "HMAC", "Webhooks", "Security"],
    category: "API Engineering",
  },
  {
    id: "4",
    ticket_id: "DB-019",
    repo: "acme-shop",
    title: "N+1 Query Investigation",
    scenario:
      "You've just joined the backend team. On your first week, the on-call alert fires: GET /api/orders/ is timing out under load. You pull the profiler output and see 1 + N database queries on every request. Your job is to find every N+1, fix them, and add assertions so the next engineer can't accidentally reintroduce them.",
    mode: "debug",
    tier: "component",
    estimated_minutes: 45,
    tags: ["Django ORM", "Query Optimization", "select_related", "Benchmarking"],
    category: "Django-Specific",
  },
  {
    id: "5",
    ticket_id: "PAY-142",
    repo: "acme-payments",
    title: "Idempotent Payment Webhook Handler",
    scenario:
      "You're fixing a live production bug. Paystack's delivery guarantee is at-least-once, and it's been biting you. The same webhook fires twice, two orders get created, and a customer gets charged double. You need to make the handler idempotent without touching the public API contract or the Paystack integration.",
    mode: "fix",
    tier: "system",
    estimated_minutes: 60,
    tags: ["Django", "Idempotency", "Webhooks", "PostgreSQL"],
    category: "API Engineering",
  },
];

const MOCK_STATUS: Record<string, Status> = {
  "1": "completed",
  "2": "in_progress",
  "3": "not_started",
  "4": "not_started",
  "5": "not_started",
};

const TIER_ORDER: Tier[] = ["utility", "component", "system", "incident"];

const MOCK_ANALYTICS = {
  completed: 1,
  inProgress: 1,
  totalMinutes: 185,
  byTier: {
    utility:   { done: 1, total: 1 },
    component: { done: 0, total: 2 },
    system:    { done: 0, total: 1 },
    incident:  { done: 0, total: 1 },
  },
};

const MOCK_SUGGESTED = {
  ticketId: "API-031",
  title: "Retry Utility with Exponential Backoff",
  mode: "build" as Mode,
  tier: "component" as Tier,
  why: "You've completed a Utility. The natural next step is a Component — this one teaches you when retrying is dangerous, which matters before you touch the payment stack.",
  id: "2",
};

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-brand-surface ${className ?? ""}`} />
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="flex items-start justify-between gap-6 border border-brand-border rounded-xl px-5 py-4">
      <div className="flex flex-col gap-2.5 flex-1 min-w-0">
        <Shimmer className="h-4 w-48" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
        <div className="flex items-center gap-2 mt-1">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-4 w-14 rounded-md" />
          <Shimmer className="h-4 w-18 rounded-md" />
          <Shimmer className="h-3 w-12" />
        </div>
      </div>
      <Shimmer className="h-8 w-16 rounded-lg shrink-0 mt-0.5" />
    </div>
  );
}

function AnalyticsSidebarSkeleton() {
  return (
    <aside className="flex flex-col gap-5 w-full">
      <div className="border border-brand-border rounded-xl bg-white p-5 flex flex-col gap-4">
        <Shimmer className="h-3 w-24" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Shimmer className="h-6 w-10" />
              <Shimmer className="h-3 w-16" />
            </div>
          ))}
        </div>
        <Shimmer className="h-1.5 w-full rounded-full" />
        <Shimmer className="h-3 w-20 -mt-2" />
      </div>

      <div className="border border-brand-border rounded-xl bg-white p-5 flex flex-col gap-4">
        <Shimmer className="h-3 w-24" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Shimmer className="size-2 rounded-full" />
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-3 w-8 ml-auto" />
            </div>
            <Shimmer className="h-1 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="border border-brand-border rounded-xl p-5 flex flex-col gap-3">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-3 w-3/4" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-8 w-full rounded-lg mt-1" />
      </div>
    </aside>
  );
}

// ─── UI primitives ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  const cfg = MODE_CONFIG[mode];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md ${cfg.color}`}>
      <Icon className="size-2.5" />
      {cfg.label}
    </span>
  );
}

function SegmentedFilter<T extends string>({
  filters,
  active,
  onChange,
  layoutId,
  counts,
}: {
  filters: { id: T; label: string; icon?: typeof Hammer }[];
  active: T;
  onChange: (id: T) => void;
  layoutId: string;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex items-center bg-brand-surface rounded-lg p-0.5 gap-0.5 self-start">
      {filters.map((f) => {
        const isActive = active === f.id;
        const Icon = f.icon;
        const count = counts?.[f.id];
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`relative flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium cursor-pointer outline-none transition-colors duration-200 ${
              isActive ? "text-brand-text" : "text-brand-text-muted hover:text-brand-text"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-md bg-white shadow-sm"
              />
            )}
            <span className="relative flex items-center gap-1">
              {Icon && <Icon className="size-3 shrink-0" />}
              {f.label}
              {count !== undefined && (
                <span className={`text-[10px] font-semibold px-1 py-px rounded tabular-nums transition-colors duration-200 ${
                  isActive ? "bg-brand-surface text-brand-text-muted" : "bg-brand-border/60 text-brand-text-subtle"
                }`}>
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProjectCard({ project, status }: { project: Project; status: Status | null }) {
  const router   = useRouter();
  const completed  = status === "completed";
  const inProgress = status === "in_progress";

  return (
    <div className={`group flex items-start justify-between gap-6 border rounded-xl px-5 py-4 cursor-pointer transition-all duration-500 hover:shadow-sm ${
      completed
        ? "bg-brand-surface/60 border-brand-border hover:border-brand-border-strong"
        : "bg-white border-brand-border-strong hover:border-brand-primary hover:bg-brand-surface/40"
    }`}>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {completed && <CheckCircle2 className="size-4 text-brand-success shrink-0" />}
          <h3 className={`font-semibold text-[15px] leading-snug ${completed ? "text-brand-text-muted" : "text-brand-text"}`}>
            {project.title}
          </h3>
        </div>

        <p className={`text-[13px] leading-relaxed line-clamp-2 ${completed ? "text-brand-text-subtle" : "text-brand-text-muted"}`}>
          {project.scenario}
        </p>

        <div className="flex items-center flex-wrap gap-2 mt-1.5">
          <span className="font-mono text-[11px] text-brand-text-subtle">#{project.ticket_id}</span>
          <span className="text-brand-border-strong text-[11px]">·</span>
          <span className="text-[11px] text-brand-text-subtle">{project.repo}</span>
          <ModeBadge mode={project.mode} />
          <TierBadge tier={project.tier} />
          <span className="flex items-center gap-1 text-[11px] text-brand-text-subtle">
            <Clock className="size-3" />
            {project.estimated_minutes} min
          </span>
          {inProgress && (
            <>
              <span className="text-brand-border-strong text-[11px]">·</span>
              <span className="flex items-center gap-1 text-[11px] text-brand-warning font-medium">
                <span className="size-1.5 rounded-full bg-brand-warning inline-block" />
                In progress
              </span>
            </>
          )}
          {completed && (
            <>
              <span className="text-brand-border-strong text-[11px]">·</span>
              <span className="text-[11px] text-brand-success font-medium">Completed</span>
            </>
          )}
          <span className="text-brand-border-strong text-[11px]">·</span>
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {completed ? (
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-brand-text-muted px-3 py-1.5 rounded-lg border border-brand-border-strong hover:bg-brand-surface transition-all duration-500 cursor-pointer mt-0.5"
        >
          Review
        </button>
      ) : (
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-white px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover transition-all duration-500 cursor-pointer mt-0.5"
        >
          {inProgress ? "Continue" : "Start"}
          <ChevronRight className="size-3" />
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[22px] font-bold text-brand-text leading-none">{value}</span>
      <span className="text-[12px] text-brand-text-muted">{label}</span>
      {sub && <span className="text-[11px] text-brand-text-subtle">{sub}</span>}
    </div>
  );
}

type AnalyticsShape = typeof MOCK_ANALYTICS;
type SuggestedShape = typeof MOCK_SUGGESTED;

function AnalyticsSidebar({
  analytics,
  suggested,
  total,
}: {
  analytics: AnalyticsShape;
  suggested: SuggestedShape;
  total: number;
}) {
  const router = useRouter();
  return (
    <aside className="flex flex-col gap-5 w-full">
      <div className="border border-brand-border-strong rounded-xl bg-white p-5 flex flex-col gap-5">
        <p className="text-[11px] font-semibold text-brand-text-subtle uppercase tracking-wider">Your Progress</p>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Completed"   value={analytics.completed}                          />
          <StatCard label="In Progress" value={analytics.inProgress}                         />
          <StatCard label="Time spent"  value={`${analytics.totalMinutes}m`}                 />
          <StatCard label="Remaining"   value={total - analytics.completed} sub={`of ${total}`} />
        </div>
        <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? Math.round((analytics.completed / total) * 100) : 0}%` }}
          />
        </div>
        <p className="text-[11px] text-brand-text-subtle -mt-3">
          {total > 0 ? Math.round((analytics.completed / total) * 100) : 0}% complete
        </p>
      </div>

      <div className="border border-brand-border-strong rounded-xl bg-white p-5 flex flex-col gap-4">
        <p className="text-[11px] font-semibold text-brand-text-subtle uppercase tracking-wider">By Difficulty</p>
        <div className="flex flex-col gap-3">
          {TIER_ORDER.map((tier) => {
            const cfg = TIER_CONFIG[tier];
            const { done, total: tierTotal } = analytics.byTier[tier];
            const pct      = tierTotal > 0 ? Math.round((done / tierTotal) * 100) : 0;
            const complete = done === tierTotal && tierTotal > 0;
            return (
              <div key={tier} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full shrink-0 ${cfg.dot} ${complete ? "opacity-100" : "opacity-30"}`} />
                  <span className={`text-[12px] font-medium ${complete ? "text-brand-text" : "text-brand-text-muted"}`}>
                    {cfg.label}
                  </span>
                  <span className="ml-auto text-[11px] tabular-nums text-brand-text-subtle">
                    {done}<span className="text-brand-border-strong">/{tierTotal}</span>
                  </span>
                </div>
                <div className="w-full h-1 bg-brand-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.dot}`}
                    style={{ width: `${pct}%`, opacity: pct === 0 ? 0 : 1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-brand-primary/30 bg-brand-primary-tint rounded-xl p-5 flex flex-col gap-3">
        <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider">Up Next</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-brand-primary/60">#{suggested.ticketId}</span>
            <ModeBadge mode={suggested.mode} />
            <TierBadge tier={suggested.tier} />
          </div>
          <p className="text-[13px] font-semibold text-brand-text leading-snug">{suggested.title}</p>
          <p className="text-[12px] text-brand-text-muted leading-relaxed">{suggested.why}</p>
        </div>
        <button
          onClick={() => router.push(`/projects/${suggested.id}`)}
          className="mt-1 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-lg py-2 transition-all duration-500 cursor-pointer"
        >
          Start this project
          <ChevronRight className="size-3" />
        </button>
      </div>
    </aside>
  );
}

function groupByCategory(projects: Project[]): [string, Project[]][] {
  const map = new Map<string, Project[]>();
  for (const p of projects) {
    const group = map.get(p.category) ?? [];
    group.push(p);
    map.set(p.category, group);
  }
  return Array.from(map.entries());
}

export default function ProjectsPage() {
  const [modeFilter, setModeFilter] = useState<Mode | "all">("all");
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");

  const { data: apiProjects, isLoading: projectsLoading } = useProjects();
  const { data: apiStats,    isLoading: statsLoading    } = useProjectStats();

  const allProjects: Project[] = (apiProjects as unknown as Project[] | undefined) ?? PROJECTS;

  const statusMap: Record<string, Status> = apiProjects
    ? Object.fromEntries(
        (apiProjects as unknown as { id: string; user_status: Status | null }[])
          .filter((p) => p.user_status)
          .map((p) => [p.id, p.user_status!])
      )
    : MOCK_STATUS;

  const filtered = allProjects.filter((p) => {
    const modeMatch = modeFilter === "all" || p.mode === modeFilter;
    const tierMatch = tierFilter === "all" || p.tier === tierFilter;
    return modeMatch && tierMatch;
  });

  const modeCounts = Object.fromEntries(
    MODE_FILTERS.map((f) => [
      f.id,
      f.id === "all" ? allProjects.length : allProjects.filter((p) => p.mode === f.id).length,
    ])
  );

  const tierCounts = Object.fromEntries(
    TIER_FILTERS.map((f) => [
      f.id,
      f.id === "all" ? allProjects.length : allProjects.filter((p) => p.tier === f.id).length,
    ])
  );

  const grouped = groupByCategory(filtered);

  const analytics: AnalyticsShape = apiStats
    ? {
        completed:    apiStats.completed,
        inProgress:   apiStats.in_progress,
        totalMinutes: apiStats.total_minutes,
        byTier: Object.fromEntries(
          TIER_ORDER.map((t) => [t, apiStats.by_tier[t] ?? { done: 0, total: 0 }])
        ) as typeof MOCK_ANALYTICS.byTier,
      }
    : MOCK_ANALYTICS;

  const suggested: SuggestedShape = apiStats?.suggested_next
    ? {
        ticketId: apiStats.suggested_next.ticket_id,
        title:    apiStats.suggested_next.title,
        mode:     apiStats.suggested_next.mode as Mode,
        tier:     apiStats.suggested_next.tier as Tier,
        why:      apiStats.suggested_next.why,
        id:       apiStats.suggested_next.id,
      }
    : MOCK_SUGGESTED;

  return (
    <div className="w-full max-w-6xl px-6 py-8 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[28px] font-bold text-brand-text">Projects</h1>
        <p className="text-[13px] text-brand-text-muted hidden sm:block">
          Real engineering tickets from production codebases.
        </p>
      </div>

      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-4 flex-[2] min-w-0">
          <div className="flex flex-col gap-2">
            <SegmentedFilter
              filters={MODE_FILTERS}
              active={modeFilter}
              onChange={setModeFilter}
              layoutId="projects-mode-filter"
              counts={modeCounts}
            />
            <SegmentedFilter
              filters={TIER_FILTERS}
              active={tierFilter}
              onChange={setTierFilter}
              layoutId="projects-tier-filter"
              counts={tierCounts}
            />
          </div>

          {projectsLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 border border-brand-border-strong rounded-xl bg-white text-center">
              <div className="size-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center">
                <Briefcase className="size-4 text-brand-text-subtle" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-medium text-brand-text">No projects match this filter</p>
                <p className="text-[12px] text-brand-text-subtle">Try adjusting the mode or difficulty.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map(([category, projects]) => (
                <div key={category} className="flex flex-col gap-3">
                  <p className="text-[11px] font-semibold text-brand-text-subtle uppercase tracking-wider px-1">
                    {category}
                  </p>
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      status={statusMap[project.id] ?? "not_started"}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {statsLoading ? (
            <AnalyticsSidebarSkeleton />
          ) : (
            <AnalyticsSidebar analytics={analytics} suggested={suggested} total={allProjects.length} />
          )}
        </div>
      </div>
    </div>
  );
}
