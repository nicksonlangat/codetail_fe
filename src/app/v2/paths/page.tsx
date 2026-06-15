"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home, Map, Briefcase, Grid2X2, Settings,
  ArrowRight, Lock, Database,
} from "lucide-react";
import { StackLogo } from "@/components/brand/stack-logos";

const t = {
  bg: "#1B1D20", surface: "#2A2D31", raised: "#32363C",
  border: "#42464E", text: "#F1F3F5", sub: "#C8D0DC",
  muted: "#8C95A3", primary: "#1FAD87", orange: "#F97316",
  violet: "#A78BFA", amber: "#FBBF24",
};
const SP  = { type: "spring" as const, stiffness: 300, damping: 30 };
const SP2 = { type: "spring" as const, stiffness: 400, damping: 25 };

const NAV = [
  { icon: Home,      label: "Home",       color: t.primary },
  { icon: Map,       label: "Paths",      color: "#60A5FA", active: true },
  { icon: Briefcase, label: "Interviews", color: t.violet },
  { icon: Grid2X2,   label: "Canvas",     color: t.orange },
  { icon: Settings,  label: "Settings",   color: t.sub },
];

type MockPath = {
  id: string; stack: string; slug: string; title: string; description: string;
  difficulty: string; topics: string[]; problem_count: number;
  solved: number; xp: number; status: "in_progress" | "completed" | "not_started";
};

const COMING_SOON = [
  {
    stack: "go", title: "Golang",
    description: "Systems-level performance meets modern simplicity. Goroutines, channels, and production Go.",
    topics: ["Goroutines", "Channels", "HTTP", "Testing", "Modules"],
  },
];

const PATHS: MockPath[] = [
  { id:"1", stack:"python",  slug:"python-mastery",  title:"Python Mastery",  description:"From fundamentals to advanced Python. Master data structures, algorithms, and Pythonic patterns.",            difficulty:"intermediate", topics:["Data Structures","OOP","Decorators","Async","Meta-programming"], problem_count:64, solved:31, xp:1240, status:"in_progress"  },
  { id:"2", stack:"django",  slug:"django-mastery",  title:"Django Mastery",  description:"Production-grade Django: ORM, views, REST APIs, authentication, and deployment.",                               difficulty:"intermediate", topics:["ORM","CBVs","REST","Auth","Middleware"],                             problem_count:52, solved:12, xp:480,  status:"in_progress"  },
  { id:"3", stack:"sql",     slug:"sql-mastery",     title:"SQL Mastery",     description:"Deep SQL: window functions, query optimization, indexing strategies, and database design.",                     difficulty:"beginner",     topics:["Joins","Window Fns","Indexes","CTEs","Aggregation"],                 problem_count:38, solved:38, xp:920,  status:"completed"    },
  { id:"4", stack:"fastapi", slug:"fastapi-path",    title:"FastAPI",         description:"Build lightning-fast Python APIs with automatic docs, type safety, and async support.",                        difficulty:"intermediate", topics:["Routing","Pydantic","Async","Auth","Middleware"],                     problem_count:44, solved:0,  xp:0,    status:"not_started"  },
];

function StackIcon({ stack, className }: { stack: string; className?: string }) {
  if (stack === "sql") return <Database className={className} style={{ color: t.sub }} />;
  return <StackLogo stack={stack} className={className} />;
}

const diffColor: Record<string, string> = {
  beginner: `${t.primary}18`,
  intermediate: `${t.amber}18`,
  advanced: `${t.orange}18`,
};
const diffText: Record<string, string> = {
  beginner: t.primary, intermediate: t.amber, advanced: t.orange,
};

function FeaturedCard({ path }: { path: MockPath }) {
  const pct = Math.round((path.solved / path.problem_count) * 100);
  return (
    <div className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-500"
      style={{ background: `${t.surface}80` }}
    >
      {/* Teal top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${t.primary}80, transparent 60%)` }} />
      {/* Hover wash */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${t.primary}06 0%, transparent 60%)` }} />

      <div className="relative flex items-stretch gap-6 p-6">
        <div className="shrink-0 flex items-center justify-center w-20">
          <StackIcon stack={path.stack} className="w-16 h-16" />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[18px] font-bold tracking-tight">{path.title}</h2>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: diffColor[path.difficulty], color: diffText[path.difficulty] }}>
                {path.difficulty}
              </span>
              {path.status === "in_progress" && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ background: `${t.amber}15`, color: t.amber }}>In Progress</span>
              )}
            </div>
            <p className="text-[13px] leading-relaxed line-clamp-2 max-w-xl" style={{ color: t.muted }}>
              {path.description}
            </p>
          </div>

          {/* Progress */}
          <div className="max-w-sm">
            <div className="flex items-center justify-between text-[9px] mb-1">
              <span style={{ color: t.muted }}>{path.solved} / {path.problem_count} solved</span>
              <span className="font-bold" style={{ color: t.primary }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.raised }}>
              <motion.div className="h-full rounded-full" style={{ background: t.primary }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-mono tabular-nums" style={{ color: t.muted }}>
              {path.problem_count} problems
            </span>
            <span style={{ color: t.border }}>·</span>
            <span className="text-[11px] capitalize" style={{ color: t.muted }}>{path.stack}</span>
            {path.xp > 0 && (
              <>
                <span style={{ color: t.border }}>·</span>
                <span className="text-[11px] font-semibold" style={{ color: t.violet }}>+{path.xp.toLocaleString()} XP</span>
              </>
            )}
            <div className="flex items-center gap-1 flex-wrap">
              {path.topics.slice(0, 5).map(tp => (
                <span key={tp} className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: t.raised, color: t.sub }}>
                  {tp}
                </span>
              ))}
              {path.topics.length > 5 && (
                <span className="text-[10px]" style={{ color: t.muted }}>+{path.topics.length - 5}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-1.5 group-hover:translate-x-0 transition-all duration-300 pt-0.5 shrink-0"
          style={{ color: t.primary }}>
          <span className="text-[12px] font-semibold">Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

function PathCard({ path }: { path: MockPath }) {
  const pct = Math.round((path.solved / path.problem_count) * 100);
  const barColor = path.status === "completed" ? t.primary : path.status === "in_progress" ? t.amber : t.border;
  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden cursor-pointer transition-all duration-500 h-full"
      style={{ background: `${t.surface}80` }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${t.primary}04 0%, transparent 55%)` }} />

      <div className="relative flex flex-col gap-4 flex-1 p-5">
        <StackIcon stack={path.stack} className="w-9 h-9 shrink-0" />

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[14px] font-semibold tracking-tight leading-snug">{path.title}</h3>
          </div>
          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: t.muted }}>
            {path.description}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {path.topics.slice(0, 3).map(tp => (
            <span key={tp} className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: t.raised, color: t.sub }}>
              {tp}
            </span>
          ))}
          {path.topics.length > 3 && (
            <span className="text-[10px]" style={{ color: t.muted }}>+{path.topics.length - 3}</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: t.raised }}>
          <motion.div className="h-full rounded-full" style={{ background: barColor }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] font-mono tabular-nums" style={{ color: t.muted }}>
            {path.solved}/{path.problem_count}
            <span className="mx-1.5 opacity-40">·</span>
            <span className="capitalize">{path.stack}</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
            style={{ color: t.primary }} />
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ stack, title, description, topics }: { stack: string; title: string; description: string; topics: string[] }) {
  return (
    <div className="relative flex flex-col rounded-lg overflow-hidden h-full opacity-50 select-none"
      style={{ background: `${t.surface}80` }}>
      <div className="flex flex-col gap-4 flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <StackIcon stack={stack} className="w-9 h-9 shrink-0 grayscale" />
          <span className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded"
            style={{ background: t.raised, color: t.muted, border: `1px solid ${t.border}` }}>
            <Lock size={8} /> Coming Soon
          </span>
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-[14px] font-semibold tracking-tight leading-snug">{title}</h3>
          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: t.muted }}>{description}</p>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {topics.slice(0, 3).map(tp => (
            <span key={tp} className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: t.raised, color: t.muted }}>
              {tp}
            </span>
          ))}
          {topics.length > 3 && <span className="text-[10px]" style={{ color: t.muted }}>+{topics.length - 3}</span>}
        </div>
        <div className="pt-3 mt-auto" style={{ borderTop: `1px solid ${t.border}` }}>
          <span className="text-[11px] capitalize" style={{ color: t.muted }}>{stack}</span>
        </div>
      </div>
    </div>
  );
}

export default function V2Paths() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  return (
    <div className="dark flex h-screen overflow-hidden font-sans p-2 gap-2" style={{ background: t.bg, color: t.text }}>

      {/* ── Sidebar ── */}
      <aside className="w-16 flex flex-col items-center justify-between py-5 shrink-0 rounded-lg"
        style={{ background: `${t.surface}99` }}>
        <div className="flex flex-col items-center gap-5 w-full">
          <svg width={28} height={28} viewBox="0 0 48 48" fill="none">
            <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke={t.primary} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke={t.primary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="w-7 h-px" style={{ background: t.border }} />
          <nav className="w-full px-2 space-y-0.5">
            {NAV.map(({ icon: Icon, label, color, active: isActive }) => {
              const lit = isActive || hoveredNav === label;
              return (
                <motion.button key={label} whileTap={{ scale: 0.96 }} transition={SP}
                  onHoverStart={() => setHoveredNav(label)} onHoverEnd={() => setHoveredNav(null)}
                  className="w-full flex flex-col items-center gap-0.5 py-2 rounded-lg cursor-pointer transition-all duration-500"
                  style={{ background: lit ? `${color}18` : "transparent", color: lit ? color : t.muted }}
                >
                  <Icon size={15} />
                  <span className="text-[8.5px] font-medium">{label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer"
              style={{ background: t.raised, color: t.primary, border: `1.5px solid ${t.primary}40` }}>NL</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
              style={{ background: t.amber, color: "#000" }}>3</div>
          </div>
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={SP}
            className="px-2 py-1 rounded-md text-[8px] font-bold tracking-wide cursor-pointer transition-all duration-500"
            style={{ background: `${t.border}60`, color: t.sub, border: `1px solid ${t.border}` }}>FREE</motion.div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto rounded-lg" style={{ background: `${t.surface}40` }}>
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: t.muted }}>
                Curated curriculum
              </p>
              <h1 className="text-[28px] font-black tracking-tight leading-none">Learning Paths</h1>
              <p className="text-[13px] leading-relaxed max-w-sm" style={{ color: t.muted }}>
                Structured tracks to take you from fundamentals to production-ready code.
              </p>
            </div>
          </div>

          {/* Featured */}
          <FeaturedCard path={PATHS[0]} />

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PATHS.slice(1).map((path, i) => (
              <motion.div key={path.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...SP, delay: 0.05 + i * 0.05 }}>
                <PathCard path={path} />
              </motion.div>
            ))}
            {COMING_SOON.map((cs, i) => (
              <motion.div key={cs.stack}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...SP, delay: 0.05 + (PATHS.slice(1).length + i) * 0.05 }}>
                <ComingSoonCard {...cs} />
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
