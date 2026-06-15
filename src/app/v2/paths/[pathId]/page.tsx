"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home, Map, Briefcase, Grid2X2, Settings,
  ArrowLeft, ChevronRight, Lock, CheckCircle2, Database,
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

type UnitState = "completed" | "in_progress" | "not_started";

type Unit = {
  unit: string; label: string; description: string;
  total: number; solved: number; free: number;
};

const MOCK_PATH = {
  slug: "python-mastery",
  title: "Python Mastery",
  stack: "python",
  difficulty: "intermediate",
  description: "From fundamentals to advanced Python. Master data structures, algorithms, and Pythonic patterns.",
  topics: ["Data Structures", "OOP", "Decorators", "Async", "Meta-programming"],
};

const MOCK_UNITS: Unit[] = [
  { unit: "fundamentals",        label: "Python Fundamentals",        description: "Variables, types, control flow, and the core Python execution model.",               total: 10, solved: 10, free: 6  },
  { unit: "builtins",            label: "Built-ins & Comprehensions",  description: "List/dict/set comprehensions, generator expressions, and built-in functions.",        total:  8, solved:  8, free: 4  },
  { unit: "data-structures",     label: "Data Structures",             description: "Stacks, queues, linked lists, trees, and choosing the right structure.",              total:  8, solved:  6, free: 3  },
  { unit: "advanced-ds",         label: "Advanced Data Structures",    description: "Heaps, tries, graphs, and algorithm complexity analysis.",                            total: 10, solved:  7, free: 3  },
  { unit: "oop",                 label: "OOP & Classes",               description: "Inheritance, mixins, dunder methods, metaclasses, and class design.",                 total:  8, solved:  0, free: 3  },
  { unit: "decorators",          label: "Decorators",                  description: "Function and class decorators, wraps, and real-world decorator patterns.",            total:  7, solved:  0, free: 2  },
  { unit: "async",               label: "Async Programming",           description: "asyncio, coroutines, event loops, and concurrent patterns.",                          total:  8, solved:  0, free: 2  },
  { unit: "meta",                label: "Meta-programming",            description: "Descriptors, __slots__, abstract base classes, and runtime code generation.",         total:  5, solved:  0, free: 2  },
];

function getUnitState(unit: Unit): UnitState {
  if (unit.solved === unit.total && unit.total > 0) return "completed";
  if (unit.solved > 0) return "in_progress";
  return "not_started";
}

function StackIcon({ stack, className }: { stack: string; className?: string }) {
  if (stack === "sql") return <Database className={className} style={{ color: t.sub }} />;
  return <StackLogo stack={stack} className={className} />;
}

const diffColor: Record<string, string> = {
  beginner: t.primary, intermediate: t.amber, advanced: t.orange,
};

function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  const state    = getUnitState(unit);
  const pct      = unit.total > 0 ? (unit.solved / unit.total) * 100 : 0;
  const proCount = unit.total - unit.free;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...SP, delay: 0.1 + index * 0.05 }}
      className="rounded-lg cursor-pointer p-5 space-y-4"
      style={{ background: `${t.surface}80` }}
    >
      {/* Logo + index + state */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StackIcon stack={MOCK_PATH.stack} className="w-5 h-5" />
          <span className="text-[11px] font-mono tabular-nums font-bold" style={{ color: `${t.muted}50` }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: t.muted }}>
          {state === "completed" ? "Complete" : state === "in_progress" ? "In Progress" : "Not Started"}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-bold leading-tight mb-1"
            style={{ color: state === "completed" ? t.muted : t.text }}>
            {unit.label}
          </h3>
          {unit.description && (
            <p className="text-[11px] leading-relaxed" style={{ color: t.muted }}>{unit.description}</p>
          )}
        </div>
        {state === "completed" && (
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: t.primary }} />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono tabular-nums" style={{ color: t.muted }}>
          {unit.total} problems
        </span>
        <span style={{ color: t.border }}>·</span>
        <span className="text-[10px]" style={{ color: t.muted }}>{unit.free} free</span>
        {proCount > 0 && (
          <span className="flex items-center gap-0.5 text-[10px]" style={{ color: t.muted }}>
            <Lock className="w-2.5 h-2.5" />{proCount} pro
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: t.raised }}>
          <motion.div className="h-full rounded-full" style={{ background: t.primary }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 + index * 0.05 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tabular-nums" style={{ color: t.muted }}>
            {unit.solved} / {unit.total} solved
          </span>
          <ChevronRight className="w-3 h-3" style={{ color: t.muted }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function V2PathDetail() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const totalSolved  = MOCK_UNITS.reduce((s, u) => s + u.solved, 0);
  const totalProblems = MOCK_UNITS.reduce((s, u) => s + u.total, 0);
  const overallPct   = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
  const nextUnit     = MOCK_UNITS.find(u => getUnitState(u) !== "completed") ?? null;

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

          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button className="inline-flex items-center gap-1 text-[11px] cursor-pointer transition-all duration-500"
              style={{ color: t.muted }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = t.text}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = t.muted}>
              <ArrowLeft className="w-3 h-3" /> Paths
            </button>
          </motion.div>

          {/* Path header */}
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={SP}>
            <div className="flex items-start gap-4">
              <StackIcon stack={MOCK_PATH.stack} className="w-10 h-10 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-[20px] font-bold tracking-tight">{MOCK_PATH.title}</h1>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: `${t.raised}`, color: t.muted }}>
                    {MOCK_PATH.difficulty}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: t.muted }}>
                  {MOCK_PATH.description}
                </p>
                {MOCK_PATH.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_PATH.topics.map(tp => (
                      <span key={tp} className="text-[10px] px-2 py-0.5 rounded"
                        style={{ background: t.raised, color: t.muted }}>
                        {tp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Progress — far right */}
              <div className="shrink-0 text-right hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider font-medium block mb-1.5"
                  style={{ color: t.muted }}>Progress</span>
                <span className="text-[13px] font-mono tabular-nums font-semibold">
                  {totalSolved}
                  <span className="font-normal" style={{ color: `${t.muted}60` }}>/{totalProblems}</span>
                </span>
                <div className="w-28 h-1 rounded-full overflow-hidden mt-1.5" style={{ background: t.raised }}>
                  <motion.div className="h-full rounded-full" style={{ background: t.primary }}
                    initial={{ width: 0 }} animate={{ width: `${overallPct}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resume / start banner */}
          {nextUnit && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...SP, delay: 0.1 }}>
              <div className="relative rounded-lg px-6 py-5 cursor-pointer"
                style={{ background: `${t.surface}80` }}>
                <div className="relative flex items-end justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-2"
                      style={{ color: `${t.muted}60` }}>
                      {getUnitState(nextUnit) === "in_progress" ? "Continue" : "Up Next"}
                    </p>
                    <h3 className="text-[26px] font-black tracking-tight leading-none mb-2">
                      {nextUnit.label}
                    </h3>
                    {nextUnit.description && (
                      <p className="text-[11px] leading-relaxed max-w-sm" style={{ color: t.muted }}>
                        {nextUnit.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                      style={{ color: `${t.muted}60` }}>Solved</p>
                    <p className="text-[30px] font-black font-mono tabular-nums leading-none">
                      {nextUnit.solved}
                      <span className="text-[16px] font-normal" style={{ color: `${t.muted}40` }}>
                        /{nextUnit.total}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="relative mt-5 h-0.5 rounded-full overflow-hidden" style={{ background: `${t.border}` }}>
                  <motion.div className="h-full rounded-full" style={{ background: t.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${nextUnit.total > 0 ? (nextUnit.solved / nextUnit.total) * 100 : 0}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Unit grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...SP, delay: 0.15 }}>
            <p className="text-[10px] uppercase tracking-wider font-medium mb-3 px-1" style={{ color: t.muted }}>
              {MOCK_UNITS.length} units
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MOCK_UNITS.map((unit, i) => (
                <UnitCard key={unit.unit} unit={unit} index={i} />
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
