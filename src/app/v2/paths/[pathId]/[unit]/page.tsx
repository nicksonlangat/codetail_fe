"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Map, Briefcase, Grid2X2, Settings, ArrowLeft,
  ChevronRight, ChevronDown, WandSparkles, BookOpen, Star,
  Lock, CheckCircle2, Code2, Wrench, HelpCircle, RefreshCcw,
  Play, Loader2, Zap, Database, Trash2,
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

type Problem = {
  id: string; title: string; type: string; difficulty: string;
  concept: string; user_status: string | null; best_score: number | null;
  description: string; locked?: boolean;
};

const MOCK_UNIT = {
  label: "Advanced Data Structures",
  stack: "python", pathTitle: "Python Mastery", pathSlug: "python-mastery",
  moduleNumber: 4,
  description: "Heaps, tries, graphs, and algorithm complexity analysis.",
};

const FREE: Problem[] = [
  { id:"1", title:"Flatten Nested Dictionaries",  type:"write_code", difficulty:"hard",   concept:"Recursion",  user_status:"solved",   best_score:92, description:"Write a function that takes a nested dict and returns a flat dict with dot-separated keys. Handle arbitrary nesting depth." },
  { id:"2", title:"Implement a Min Heap",          type:"write_code", difficulty:"medium", concept:"Heaps",      user_status:"attempted", best_score:65, description:"Build a MinHeap class from scratch with insert, extract_min, and heapify. All operations must maintain the heap invariant." },
  { id:"3", title:"Binary Search Tree Traversal",  type:"fix_code",   difficulty:"medium", concept:"Trees",      user_status:null,        best_score:null, description:"The provided BST has a bug in its inorder traversal. Identify and fix the recursive logic so nodes are visited in ascending order." },
  { id:"4", title:"Graph BFS vs DFS",              type:"mcq",        difficulty:"easy",   concept:"Graphs",     user_status:null,        best_score:null, description:"Choose the correct approach: given a weighted graph, determine whether BFS or DFS is better suited for finding the shortest unweighted path." },
];

const PRO_LOCKED: Problem[] = [
  { id:"5",  title:"Trie Autocomplete",           type:"write_code", difficulty:"hard",   concept:"Tries",       user_status:null, best_score:null, description:"", locked:true },
  { id:"6",  title:"LRU Cache Implementation",    type:"write_code", difficulty:"hard",   concept:"Design",      user_status:null, best_score:null, description:"", locked:true },
  { id:"7",  title:"Segment Tree Range Query",    type:"write_code", difficulty:"hard",   concept:"Seg Trees",   user_status:null, best_score:null, description:"", locked:true },
  { id:"8",  title:"Disjoint Set Union",          type:"write_code", difficulty:"medium", concept:"Union-Find",  user_status:null, best_score:null, description:"", locked:true },
  { id:"9",  title:"Topological Sort",            type:"write_code", difficulty:"medium", concept:"DAGs",        user_status:null, best_score:null, description:"", locked:true },
  { id:"10", title:"Advanced Heap Operations",    type:"refactor",   difficulty:"hard",   concept:"Heaps",       user_status:null, best_score:null, description:"", locked:true },
];

const GENERATED: Problem[] = [
  { id:"g1", title:"Sliding Window Maximum", type:"write_code", difficulty:"hard", concept:"Deque", user_status:null, best_score:null, description:"Given an array of integers and a window size k, return the maximum value in each window as it slides from left to right. Your solution must run in O(n) using a monotonic deque." },
];

const diffDot: Record<string, string> = { easy: t.primary, medium: t.orange, hard: "#EF4444" };
const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  write_code: { label:"Code",    icon:<Code2      className="w-3 h-3"/>, color:"#60A5FA" },
  fix_code:   { label:"Fix",     icon:<Wrench     className="w-3 h-3"/>, color:t.orange  },
  mcq:        { label:"MCQ",     icon:<HelpCircle className="w-3 h-3"/>, color:t.violet  },
  refactor:   { label:"Refactor",icon:<RefreshCcw className="w-3 h-3"/>, color:t.primary },
};

function StackIcon({ stack, className }: { stack: string; className?: string }) {
  if (stack === "sql") return <Database className={className} style={{ color: t.sub }} />;
  return <StackLogo stack={stack} className={className} />;
}

function ChallengeRow({ problem, index, expanded, onToggle, onDelete }: {
  problem: Problem; index: number; expanded: boolean; onToggle: () => void; onDelete?: () => void;
}) {
  const tc = typeConfig[problem.type];
  const ctaLabel = problem.user_status === "solved" ? "Revisit" : problem.user_status === "attempted" ? "Continue" : "Start Challenge";

  return (
    <motion.div layout="position" className="rounded-lg overflow-hidden cursor-pointer"
      style={{ background: `${t.surface}80` }}>
      <div onClick={onToggle}
        className="flex items-center gap-4 px-5 py-4 cursor-pointer group transition-all duration-500">
        <span className="text-[28px] font-bold tabular-nums w-10 shrink-0 leading-none select-none"
          style={{ color: `${t.muted}20` }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold mb-1 transition-all duration-500"
            style={{ color: t.text }}>
            {problem.title}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: diffDot[problem.difficulty] ?? t.muted }} />
            <span className="text-[11px] capitalize" style={{ color: `${t.muted}80` }}>{problem.difficulty}</span>
            {problem.concept && <>
              <span style={{ color: `${t.border}60` }}>·</span>
              <span className="text-[11px]" style={{ color: `${t.muted}60` }}>{problem.concept}</span>
            </>}
            {tc && <>
              <span style={{ color: `${t.border}60` }}>·</span>
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-medium" style={{ color: tc.color }}>
                {tc.icon} {tc.label}
              </span>
            </>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {problem.user_status === "solved" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${t.primary}18`, color: t.primary }}>Solved</span>
          )}
          {problem.user_status === "attempted" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${t.primary}14`, color: t.primary }}>In progress</span>
          )}
          {problem.best_score != null && problem.best_score > 0 && (
            <span className="text-[11px] font-mono font-semibold tabular-nums"
              style={{ color: problem.best_score >= 90 ? t.primary : problem.best_score >= 70 ? t.amber : t.orange }}>
              {problem.best_score}%
            </span>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded cursor-pointer transition-all duration-150 hover:text-red-400"
              style={{ color: `${t.muted}40` }}>
              <Trash2 className="w-3 h-3"/>
            </button>
          )}
          <span style={{ color: `${t.muted}40` }}>
            {expanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 160, opacity: 1, transition: { type:"spring", stiffness:280, damping:28 } }}
            exit={{ height: 0, opacity: 0, transition: { type:"spring", stiffness:320, damping:36 } }}
            className="overflow-hidden"
          >
            <div className="flex flex-col h-full" style={{ borderTop: `1px solid ${t.border}30` }}>
              <div className="flex-1 relative px-5 pt-4 pb-0 overflow-hidden">
                {problem.description && (
                  <p className="text-[12px] leading-relaxed" style={{ color: `${t.muted}90` }}>
                    {problem.description}
                  </p>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                  style={{ background: `linear-gradient(to top, ${t.surface}cc, transparent)` }} />
              </div>
              <div className="flex items-center gap-4 px-5 py-3 shrink-0">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} transition={SP2}
                  className="flex items-center gap-2 text-[12px] font-semibold px-5 py-2 rounded cursor-pointer transition-all duration-500"
                  style={{ background: t.primary, color: "#fff" }}>
                  <Play className="w-3 h-3 fill-current"/>
                  {ctaLabel}
                </motion.button>
                {problem.best_score != null && problem.best_score > 0 && (
                  <span className="text-[11px]" style={{ color: `${t.muted}50` }}>{problem.best_score}% best score</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function V2UnitPage() {
  const [hoveredNav, setHoveredNav]     = useState<string | null>(null);
  const [expandedId, setExpandedId]     = useState<string | null>("2"); // pre-expand "in progress" row
  const [generating, setGenerating]     = useState(false);
  const [genProblems, setGenProblems]   = useState<Problem[]>(GENERATED);
  const [generatedOpen, setGeneratedOpen] = useState(true);

  const solvedCount  = FREE.filter(p => p.user_status === "solved").length;
  const totalCurated = FREE.length + PRO_LOCKED.length;
  const progressPct  = FREE.length > 0 ? Math.round((solvedCount / FREE.length) * 100) : 0;
  const resumeProblem = FREE.find(p => p.user_status === "attempted") ?? FREE.find(p => !p.user_status);

  function toggle(id: string) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className="dark flex h-screen overflow-hidden font-sans p-2 gap-2" style={{ background: t.bg, color: t.text }}>

      {/* ── Sidebar ── */}
      <aside className="w-16 flex flex-col items-center justify-between py-5 shrink-0 rounded-lg"
        style={{ background: `${t.surface}99` }}>
        <div className="flex flex-col items-center gap-5 w-full">
          <svg width={28} height={28} viewBox="0 0 48 48" fill="none">
            <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke={t.primary} strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke={t.primary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="w-7 h-px" style={{ background: t.border }}/>
          <nav className="w-full px-2 space-y-0.5">
            {NAV.map(({ icon: Icon, label, color, active: isActive }) => {
              const lit = isActive || hoveredNav === label;
              return (
                <motion.button key={label} whileTap={{ scale:0.96 }} transition={SP}
                  onHoverStart={() => setHoveredNav(label)} onHoverEnd={() => setHoveredNav(null)}
                  className="w-full flex flex-col items-center gap-0.5 py-2 rounded-lg cursor-pointer transition-all duration-500"
                  style={{ background: lit ? `${color}18` : "transparent", color: lit ? color : t.muted }}>
                  <Icon size={15}/>
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
              style={{ background: t.amber, color:"#000" }}>3</div>
          </div>
          <div className="px-2 py-1 rounded-md text-[8px] font-bold tracking-wide cursor-pointer transition-all duration-500"
            style={{ background:`${t.border}60`, color:t.sub, border:`1px solid ${t.border}` }}>FREE</div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto rounded-lg" style={{ background:`${t.surface}40` }}>
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

          {/* Breadcrumb */}
          <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="inline-flex items-center gap-1 text-[11px] cursor-pointer transition-all duration-500"
            style={{ color: t.muted }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = t.text}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = t.muted}>
            <ArrowLeft className="w-3 h-3"/> {MOCK_UNIT.pathTitle}
          </motion.button>

          {/* ── Hero ── */}
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={SP}
            className="flex gap-8 items-start">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: t.primary }}>
                Module {String(MOCK_UNIT.moduleNumber).padStart(2,"0")} · {MOCK_UNIT.pathTitle}
              </p>
              <h1 className="text-[48px] font-black tracking-tighter leading-none mb-3">
                {MOCK_UNIT.label}
              </h1>
              <p className="text-[13px] leading-relaxed mb-4 max-w-lg" style={{ color: t.muted }}>
                {MOCK_UNIT.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded"
                  style={{ color: t.muted, border:`1px solid ${t.border}60` }}>
                  <BookOpen className="w-3 h-3"/> {FREE.length + PRO_LOCKED.length} challenges
                </span>
                <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded"
                  style={{ color: t.muted, border:`1px solid ${t.border}60` }}>
                  {FREE.length} free · {PRO_LOCKED.length} pro
                </span>
                <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded cursor-pointer transition-all duration-500"
                  style={{ color: t.amber, border:`1px solid ${t.amber}30`, background:`${t.amber}08` }}>
                  <WandSparkles className="w-3 h-3"/> unlimited AI with Pro
                </span>
              </div>
            </div>

            {/* Resume card */}
            {resumeProblem && (
              <div className="relative w-60 shrink-0 rounded-lg p-5 space-y-4 overflow-hidden"
                style={{ background: t.primary }}>
                <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full"
                  style={{ background:"rgba(255,255,255,0.08)" }}/>
                <p className="text-[9px] font-semibold uppercase tracking-widest relative flex items-center gap-1.5"
                  style={{ color:"rgba(255,255,255,0.7)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"/>
                  {resumeProblem.user_status === "attempted" ? "Jump back in" : "Up next"}
                </p>
                <div className="relative">
                  <p className="text-[10px] font-mono mb-1" style={{ color:"rgba(255,255,255,0.5)" }}>
                    Challenge {String(FREE.indexOf(resumeProblem) + 1).padStart(2,"0")}
                  </p>
                  <p className="text-[17px] font-bold leading-snug" style={{ color:"#fff" }}>
                    {resumeProblem.title}
                  </p>
                </div>
                {resumeProblem.best_score != null && resumeProblem.best_score > 0 && (
                  <div className="space-y-1.5 relative">
                    <div className="h-1 rounded overflow-hidden" style={{ background:"rgba(255,255,255,0.2)" }}>
                      <div className="h-full rounded bg-white" style={{ width:`${resumeProblem.best_score}%` }}/>
                    </div>
                    <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.5)" }}>
                      {resumeProblem.best_score}% · resuming
                    </p>
                  </div>
                )}
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} transition={SP2}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-full cursor-pointer transition-all duration-500"
                  style={{ background:"#fff", color: t.primary }}>
                  <Play className="w-3 h-3 fill-current"/>
                  {resumeProblem.user_status === "attempted" ? "Resume Challenge" : "Start Challenge"}
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Progress strip */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ ...SP, delay:0.05 }}
            className="flex items-center gap-4 px-5 py-3 rounded-lg"
            style={{ background:`${t.surface}80` }}>
            <span className="text-[11px] font-medium shrink-0" style={{ color:`${t.muted}80` }}>Your progress</span>
            <div className="flex-1 h-2 rounded overflow-hidden" style={{ background: t.raised }}>
              <motion.div className="h-full rounded" style={{ background: t.primary }}
                initial={{ width:0 }} animate={{ width:`${progressPct}%` }}
                transition={{ duration:0.9, ease:"easeOut", delay:0.3 }}/>
            </div>
            <span className="text-[11px] font-mono tabular-nums shrink-0" style={{ color:`${t.muted}80` }}>
              {solvedCount} / {FREE.length} complete
            </span>
          </motion.div>

          {/* ── Free section ── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ ...SP, delay:0.1 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:`${t.muted}80` }}>Free</span>
              <span className="text-[10px] font-mono" style={{ color:`${t.muted}40` }}>{FREE.length}</span>
              <div className="flex-1 h-px" style={{ background:`${t.border}50` }}/>
            </div>
            <div className="space-y-2">
              {FREE.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                  transition={{ ...SP, delay: i * 0.04 }}>
                  <ChallengeRow problem={p} index={i} expanded={expandedId === p.id} onToggle={() => toggle(p.id)}/>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Pro locked section ── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ ...SP, delay:0.15 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <Star className="w-3 h-3" style={{ color: t.muted }}/>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:`${t.muted}80` }}>Pro</span>
              <span className="text-[10px] font-mono" style={{ color:`${t.muted}40` }}>{PRO_LOCKED.length}</span>
              <div className="flex-1 h-px" style={{ background:`${t.border}50` }}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
              {/* Locked list */}
              <div className="rounded-lg overflow-hidden" style={{ background:`${t.surface}80` }}>
                {PRO_LOCKED.map((p) => {
                  const tc = typeConfig[p.type];
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-3.5"
                      style={{ borderBottom:`1px solid ${t.border}20` }}>
                      <div className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                        style={{ background: t.raised }}>
                        <Lock className="w-3 h-3" style={{ color:`${t.muted}60` }}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium" style={{ color: t.text }}>{p.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: diffDot[p.difficulty] ?? t.muted }}/>
                          <span className="text-[10px] capitalize" style={{ color:`${t.muted}60` }}>{p.difficulty}</span>
                          {tc && <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: tc.color }}>
                            {tc.icon} {tc.label}
                          </span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Upgrade card */}
              <div className="rounded-lg p-5 flex flex-col gap-5" style={{ background:`${t.surface}80` }}>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest w-fit px-2 py-1 rounded"
                  style={{ background:`${t.amber}12`, color: t.amber, border:`1px solid ${t.amber}25` }}>
                  <Star className="w-2.5 h-2.5"/> Codetail Pro
                </span>
                <div>
                  <p className="text-[17px] font-bold leading-tight mb-2">
                    Finish what you <span style={{ color: t.amber }}>started.</span>
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color:`${t.muted}90` }}>
                    Unlock all {PRO_LOCKED.length} Pro challenges in this unit — and every path.
                  </p>
                </div>
                <ul className="space-y-2">
                  {[
                    `All ${PRO_LOCKED.length} Pro challenges here`,
                    "Worked solutions & hints",
                    "Every Pro path, unlimited",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[12px]" style={{ color:`${t.muted}90` }}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color:`${t.amber}90` }}/>
                      {item}
                    </li>
                  ))}
                </ul>
                <div>
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} transition={SP2}
                    className="w-full flex items-center justify-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded cursor-pointer transition-all duration-500"
                    style={{ background: t.amber, color:"#000" }}>
                    <Zap className="w-3.5 h-3.5"/> Go Pro
                  </motion.button>
                  <p className="text-[10px] text-center mt-2" style={{ color:`${t.muted}50` }}>Cancel anytime</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── AI section ── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ ...SP, delay:0.2 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <WandSparkles className="w-3 h-3" style={{ color: t.primary }}/>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:`${t.primary}cc` }}>AI</span>
              {genProblems.length > 0 && (
                <span className="text-[10px] font-mono" style={{ color:`${t.muted}40` }}>{genProblems.length}</span>
              )}
              <div className="flex-1 h-px" style={{ background:`${t.primary}20` }}/>
              {genProblems.length > 0 && (
                <motion.button onClick={() => setGeneratedOpen(o => !o)}
                  className="cursor-pointer transition-all duration-150" style={{ color:`${t.muted}50` }}>
                  <motion.div animate={{ rotate: generatedOpen ? 90 : 0 }} transition={SP}>
                    <ChevronRight className="w-3.5 h-3.5"/>
                  </motion.div>
                </motion.button>
              )}
              <motion.button
                onClick={() => {
                  setGenerating(true);
                  setTimeout(() => {
                    setGenProblems(prev => [...prev, {
                      id: `g${prev.length + 1}`,
                      title: "Priority Queue with Custom Comparator",
                      type: "write_code", difficulty: "medium", concept: "Heaps",
                      user_status: null, best_score: null,
                      description: "Implement a generic priority queue that accepts a custom comparator function. It must support push, pop, and peek in O(log n) time.",
                    }]);
                    setGenerating(false);
                    setGeneratedOpen(true);
                  }, 2500);
                }}
                disabled={generating}
                whileHover={generating ? {} : { scale:1.02 }} whileTap={generating ? {} : { scale:0.97 }} transition={SP}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded cursor-pointer disabled:opacity-50 transition-all duration-500"
                style={{ background: t.primary, color:"#fff" }}>
                {generating
                  ? <><Loader2 className="w-3 h-3 animate-spin"/> Generating…</>
                  : <><WandSparkles className="w-3 h-3"/> Generate</>
                }
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {generating && (
                <motion.div key="gen-loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex items-center gap-3 px-5 py-4 rounded-lg mb-3"
                  style={{ border:`1px solid ${t.primary}25`, background:`${t.primary}06` }}>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color:`${t.primary}70` }}/>
                  <span className="text-[12px]" style={{ color:`${t.primary}80` }}>
                    Building your challenge — this takes ~20s…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {generatedOpen && genProblems.length > 0 && (
                <motion.div
                  initial={{ height:0, opacity:0 }}
                  animate={{ height:"auto", opacity:1, transition: SP }}
                  exit={{ height:0, opacity:0, transition:{ type:"spring", stiffness:320, damping:36 } }}
                  className="overflow-hidden space-y-2">
                  {genProblems.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                      transition={{ ...SP, delay: i * 0.04 }}>
                      <ChallengeRow problem={p} index={FREE.length + PRO_LOCKED.length + i}
                        expanded={expandedId === p.id} onToggle={() => toggle(p.id)}
                        onDelete={() => setGenProblems(prev => prev.filter(x => x.id !== p.id))}/>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {genProblems.length === 0 && !generating && (
                <motion.div key="gen-empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex items-center gap-3 px-5 py-4 rounded-lg"
                  style={{ border:`1px dashed ${t.primary}25`, background:`${t.primary}06` }}>
                  <WandSparkles className="w-4 h-4 shrink-0" style={{ color:`${t.primary}50` }}/>
                  <span className="text-[12px]" style={{ color:`${t.muted}80` }}>
                    Hit <span className="font-semibold" style={{ color:`${t.primary}cc` }}>Generate</span> to create a custom {MOCK_UNIT.label} challenge tailored to you.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
