"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Map, Briefcase, Grid2X2, Settings,
  WandSparkles, ChevronRight, ArrowUpRight, Database,
} from "lucide-react";
import { StackLogo } from "@/components/brand/stack-logos";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { RankCard } from "@/components/dashboard/rank-card";
import { StreakCompact } from "@/components/dashboard/streak-compact";
import { BadgesCard } from "@/components/dashboard/badges-card";

const t = {
  bg:      "#1B1D20",
  surface: "#2A2D31",
  raised:  "#32363C",
  border:  "#42464E",
  text:    "#F1F3F5",
  sub:     "#C8D0DC",
  muted:   "#8C95A3",
  primary: "#1FAD87",
  orange:  "#F97316",
  violet:  "#A78BFA",
  amber:   "#FBBF24",
};

const SP = { type: "spring" as const, stiffness: 300, damping: 30 };

const NAV = [
  { icon: Home,      label: "Home",       color: t.primary, active: true  },
  { icon: Map,       label: "Paths",      color: "#60A5FA"               },
  { icon: Briefcase, label: "Interviews", color: t.violet                },
  { icon: Grid2X2,   label: "Canvas",     color: t.orange                },
  { icon: Settings,  label: "Settings",   color: t.sub                   },
];

const PROBLEMS = [
  { id: "1", stack: "python",  title: "Flatten Nested Dictionaries",  unit: "Advanced Data Structures", path: "Python Mastery",  type: "write_code", diff: "hard",   status: "solved",    score: 92,  xp: 120, hints: 1, reviews: 0, attempts: 2, time: "14m", ago: "2h ago"    },
  { id: "2", stack: "django",  title: "Django ORM N+1 Query",          unit: "Database Optimization",    path: "Django Mastery",  type: "fix_code",   diff: "medium", status: "solved",    score: 100, xp: 80,  hints: 0, reviews: 1, attempts: 1, time: "8m",  ago: "Yesterday" },
  { id: "3", stack: "fastapi", title: "FastAPI Dependency Injection",   unit: "Advanced Patterns",        path: "FastAPI Path",    type: "refactor",   diff: "medium", status: "attempted", score: 60,  xp: 0,   hints: 2, reviews: 1, attempts: 3, time: "22m", ago: "2d ago"    },
  { id: "4", stack: "sql",     title: "SQL Window Functions MCQ",       unit: "Advanced Queries",         path: "SQL Mastery",     type: "mcq",        diff: "easy",   status: "solved",    score: 100, xp: 40,  hints: 0, reviews: 0, attempts: 1, time: "3m",  ago: "3d ago"    },
  { id: "5", stack: "python",  title: "Generator Expressions",          unit: "Python Internals",         path: "Python Mastery",  type: "write_code", diff: "medium", status: "attempted", score: 45,  xp: 0,   hints: 3, reviews: 2, attempts: 5, time: "31m", ago: "4d ago"    },
  { id: "6", stack: "django",  title: "Django CBV Mixins",              unit: "Class-Based Views",        path: "Django Mastery",  type: "write_code", diff: "medium", status: "solved",    score: 88,  xp: 80,  hints: 1, reviews: 0, attempts: 2, time: "18m", ago: "5d ago"    },
  { id: "7", stack: "python",  title: "Python Decorators Deep Dive",    unit: "Meta-programming",         path: "Python Mastery",  type: "fix_code",   diff: "hard",   status: "solved",    score: 76,  xp: 110, hints: 2, reviews: 1, attempts: 3, time: "26m", ago: "6d ago"    },
  {
    id: "8", stack: "sql",     title: "SQL Indexing Strategies MCQ",   unit: "Performance Tuning",       path: "SQL Mastery",     type: "mcq",        diff: "medium", status: "attempted", score: 55,  xp: 0,   hints: 1, reviews: 0, attempts: 2, time: "12m", ago: "1w ago"
  },
  {
    id: "9", stack: "python",  title: "Python Context Managers",        unit: "Advanced Patterns",          path: "Python Mastery",  type: "write_code", diff: "medium", status: "attempted", score: 65,  xp: 0,   hints: 2, reviews: 1, attempts: 4, time: "25m", ago: "1w ago"
  },
  {
    id: "10", stack: "fastapi", title: "FastAPI Background Tasks",       unit: "Asynchronous Programming",   path: "FastAPI Path",    type: "refactor",   diff: "hard",   status: "solved",    score: 95,  xp: 130, hints: 0, reviews: 0, attempts: 1, time: "20m", ago: "1w ago"
  },
];

const TYPE_LABEL: Record<string, string>  = { write_code: "Write", fix_code: "Fix", refactor: "Refactor", mcq: "MCQ" };
const DIFF_COLOR: Record<string, string>  = { hard: t.orange, medium: t.amber, easy: t.primary };
const STATUS_COLOR: Record<string, string> = { solved: t.primary, attempted: t.amber };

function scoreColor(s: number) {
  if (s >= 90) return t.primary;
  if (s >= 70) return t.amber;
  return t.orange;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ color: t.muted }}>{children}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border ${className}`} style={{ background: t.surface, borderColor: t.border }}>
      {children}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px]" style={{ color: t.muted }}>{label}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color: color ?? t.text }}>{value}</span>
    </div>
  );
}

export default function V2Dashboard() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            {NAV.map(({ icon: Icon, label, color, active }) => {
              const lit = active || hoveredNav === label;
              return (
                <motion.button key={label}
                  whileTap={{ scale: 0.96 }} transition={SP}
                  onHoverStart={() => setHoveredNav(label)}
                  onHoverEnd={() => setHoveredNav(null)}
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
              style={{ background: t.raised, color: t.primary, border: `1.5px solid ${t.primary}40` }}>
              NL
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
              style={{ background: t.amber, color: "#000" }}>
              3
            </div>
          </div>
          {false /* isPro */ ? (
            <div className="px-2 py-1 rounded-md text-[8px] font-black tracking-wide cursor-pointer"
              style={{ background: `${t.amber}25`, color: t.amber, border: `1px solid ${t.amber}50` }}>
              ✦ PRO
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={SP}
              className="px-2 py-1 rounded-md text-[8px] font-bold tracking-wide cursor-pointer transition-all duration-500"
              style={{ background: `${t.border}60`, color: t.sub, border: `1px solid ${t.border}` }}>
              FREE
            </motion.div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto rounded-lg" style={{ background: `${t.surface}40` }}>
        <div className="p-5 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-bold tracking-tight">
                Good morning, <span style={{ color: t.primary }}>Nick</span>
              </h1>
              <p className="text-[11px] mt-0.5" style={{ color: t.muted }}>
                Sunday · 12-day streak · top 15% this week
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md cursor-pointer"
                style={{ background: `${t.primary}18`, color: t.primary }}>
                <WandSparkles size={11} /> Ask AI
              </motion.button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer border"
                style={{ background: t.raised, borderColor: t.border }}>
                NL
              </div>
            </div>
          </div>

          {/* Rank + streak + badges */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3"><RankCard /></div>
            <div className="col-span-1 flex flex-col gap-4">
              <Card className="p-4 flex-1">
                <SLabel>Streak</SLabel>
                <StreakCompact />
              </Card>
              <BadgesCard />
            </div>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-3 gap-4">

            {/* Col 1+2 — recent problems */}
            <div className="col-span-2 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <SLabel>Recent problems</SLabel>
                  <span className="text-[9px] cursor-pointer transition-all duration-500 -mt-3"
                    style={{ color: t.primary }}>View all</span>
                </div>

                <div className="space-y-1.5">
                  {PROBLEMS.map((p) => {
                    const open = expandedId === p.id;
                    return (
                      <div key={p.id} className="rounded-lg overflow-hidden" style={{ background: `${t.surface}80` }}>
                        {/* Row */}
                        <motion.button
                          onClick={() => setExpandedId(open ? null : p.id)}
                          className="w-full grid items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-all duration-500"
                          style={{ gridTemplateColumns: "28px 3fr 1fr 1fr 1.2fr 1fr 1fr 1fr 16px" }}
                          onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = `${t.raised}80`; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          {/* Logo + status dot */}
                          <div className="relative">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: t.raised }}>
                              {p.stack === "sql"
                                ? <Database size={14} style={{ color: t.sub }} />
                                : <StackLogo stack={p.stack} className="w-4 h-4" />
                              }
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border"
                              style={{ background: STATUS_COLOR[p.status] ?? t.muted, borderColor: t.surface }} />
                          </div>

                          {/* Title */}
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium truncate">{p.title}</p>
                            <p className="text-[9px] truncate mt-0.5" style={{ color: t.muted }}>{p.path} · {p.unit}</p>
                          </div>

                          {/* Score */}
                          <span className="text-[11px] font-bold tabular-nums"
                            style={{ color: p.status === "attempted" ? t.amber : scoreColor(p.score) }}>
                            {p.score}%
                          </span>

                          {/* Type */}
                          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded text-center"
                            style={{ background: t.raised, color: t.sub }}>
                            {TYPE_LABEL[p.type]}
                          </span>

                          {/* Difficulty */}
                          <span className="text-[9px] font-semibold" style={{ color: DIFF_COLOR[p.diff] }}>{p.diff}</span>

                          {/* Hints */}
                          <span className="text-[9px] tabular-nums" style={{ color: p.hints > 0 ? t.amber : t.muted }}>
                            {p.hints} hints
                          </span>

                          {/* AI reviews */}
                          <span className="text-[9px] tabular-nums" style={{ color: p.reviews > 0 ? t.violet : t.muted }}>
                            {p.reviews} AI
                          </span>

                          {/* Time ago */}
                          <span className="text-[9px] text-right" style={{ color: t.muted }}>{p.ago}</span>

                          {/* Chevron */}
                          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={SP} className="flex justify-end">
                            <ChevronRight size={12} style={{ color: t.muted }} />
                          </motion.div>
                        </motion.button>

                        {/* Expanded detail */}
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-4 pt-1 space-y-3"
                                style={{ background: `${t.raised}60`, borderTop: `1px solid ${t.border}` }}>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-3 pt-2">
                                  <Stat label="Score"    value={`${p.score}/100`}   color={scoreColor(p.score)} />
                                  <Stat label="Attempts" value={String(p.attempts)} />
                                  <Stat label="Time"     value={p.time} />
                                  <Stat label="Hints used"   value={String(p.hints)}   color={p.hints > 0 ? t.amber : t.muted} />
                                  <Stat label="AI reviews"   value={String(p.reviews)} color={p.reviews > 0 ? t.violet : t.muted} />
                                  <Stat label="XP earned"    value={p.xp > 0 ? `+${p.xp}` : "—"} color={p.xp > 0 ? t.primary : t.muted} />
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SP}
                                  className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-md cursor-pointer"
                                  style={{ background: `${t.primary}18`, color: t.primary }}
                                >
                                  Revisit problem <ArrowUpRight size={10} />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
            </div>

            {/* Col 3 — activity → badges → leaderboard */}
            <div className="space-y-4">
              <HeatmapCard />
              <LeaderboardCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
