"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResizableHandle, ResizablePanel, ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ChevronLeft, ChevronRight, FileText, StickyNote,
  FlaskConical, Lightbulb, Bot, BookOpen, Play, Send, RotateCcw,
  CheckCircle2, XCircle, ArrowRight as ArrowRightIcon,
  Home, Map, Briefcase, Grid2X2, Settings,
} from "lucide-react";

const NAV = [
  { icon: Home,      label: "Home",       color: "#1FAD87" },
  { icon: Map,       label: "Paths",      color: "#60A5FA", active: true },
  { icon: Briefcase, label: "Interviews", color: "#A78BFA" },
  { icon: Grid2X2,   label: "Canvas",     color: "#F97316" },
  { icon: Settings,  label: "Settings",   color: "#C8D0DC" },
];

const t = {
  bg: "#1B1D20", surface: "#2A2D31", raised: "#32363C",
  border: "#42464E", text: "#F1F3F5", sub: "#C8D0DC",
  muted: "#8C95A3", primary: "#1FAD87", orange: "#F97316",
  violet: "#A78BFA", amber: "#FBBF24",
};
const SP  = { type: "spring" as const, stiffness: 300, damping: 30 };
const SP2 = { type: "spring" as const, stiffness: 400, damping: 25 };

// ── Mock data ──────────────────────────────────────────────────────────────
const PROBLEM = {
  title: "Implement a Min Heap",
  difficulty: "medium", type: "write_code", concept: "Heaps",
  description: "Build a MinHeap class from scratch supporting insert, extract_min, and peek. All operations must maintain the heap invariant: every parent node is smaller than or equal to its children.",
  functionSignature: "class MinHeap:\n    def insert(self, val: int) -> None: ...\n    def extract_min(self) -> int: ...\n    def peek(self) -> int: ...",
  examples: [
    { input: "h = MinHeap(); h.insert(5); h.insert(2); h.insert(8)", output: "h.peek() → 2", explanation: "2 is the smallest element and should sit at the root." },
    { input: "h.extract_min()", output: "2", explanation: "Removes and returns the minimum. After extraction, peek() → 5." },
  ],
  status: "attempted", score: 65,
};

const STARTER_CODE = `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val: int) -> None:
        self.heap.append(val)
        self._sift_up(len(self.heap) - 1)

    def extract_min(self) -> int:
        if not self.heap:
            return None  # should raise IndexError
        min_val = self.heap[0]
        last = self.heap.pop()
        if self.heap:
            self.heap[0] = last
            self._sift_down(0)
        return min_val

    def peek(self) -> int:
        return self.heap[0] if self.heap else None

    def _sift_up(self, i: int) -> None:
        while i > 0:
            parent = (i - 1) // 2
            if self.heap[parent] > self.heap[i]:
                self.heap[parent], self.heap[i] = \\
                    self.heap[i], self.heap[parent]
                i = parent
            else:
                break

    def _sift_down(self, i: int) -> None:
        n = len(self.heap)
        while True:
            smallest = i
            left, right = 2 * i + 1, 2 * i + 2
            if left < n and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < n and self.heap[right] < self.heap[smallest]:
                smallest = right
            if smallest == i:
                break
            self.heap[i], self.heap[smallest] = \\
                self.heap[smallest], self.heap[i]
            i = smallest
`;

const TEST_RESULTS = [
  { label: "TC 1", input: "insert(5, 2, 8) → peek()", expected: "2", actual: "2", passed: true },
  { label: "TC 2", input: "insert(3, 1, 7) → extract_min()", expected: "1", actual: "1", passed: true },
  { label: "TC 3", input: "extract_min() on empty heap", expected: "IndexError", actual: "None", passed: false },
];

const HINTS = [
  { hint_number: 1, level: "gentle", hint: "Think about what happens when you have a node with two children. How do you decide which child to swap with?" },
];

const REVIEW = {
  score: 72,
  summary: "Clean structure and clear method names, but extract_min swallows the empty-heap edge case silently instead of raising.",
  attributes: { correctness: 65, design: 82, clarity: 88, efficiency: 74 },
  strengths: ["MinHeap class structure is clean and easy to follow", "insert() correctly calls _sift_up and maintains invariant"],
  issues: ["extract_min returns None instead of raising IndexError on empty heap", "_sift_down subtly off — misses last level on certain inputs"],
  suggestions: ["Add `if not self.heap: raise IndexError(\"heap is empty\")` at top of extract_min", "Test with a complete binary tree of depth 3 to surface the _sift_down edge case"],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreColor(v: number) {
  return v >= 90 ? t.primary : v >= 70 ? t.amber : v >= 50 ? t.orange : "#EF4444";
}

function highlight(code: string) {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    // GitHub Dark syntax colors
    .replace(/(#[^\n]*)/g, `<span style="color:#8B949E;font-style:italic">$1</span>`)
    .replace(/\b(class|def|if|else|elif|while|for|return|not|in|and|or|True|False|None|self|import|from|as|with|try|except|raise|pass|lambda)\b/g, `<span style="color:#FF7B72">$1</span>`)
    .replace(/\b(int|str|list|bool|float|dict|set|tuple|Optional|List|Any)\b/g, `<span style="color:#FFA657">$1</span>`)
    .replace(/\b(\d+)\b/g, `<span style="color:#79C0FF">$1</span>`)
    .replace(/(["'][^"']*["'])/g, `<span style="color:#A5D6FF">$1</span>`)
    .replace(/\b([a-z_][a-z0-9_]*)\s*(?=\()/g, `<span style="color:#D2A8FF">$1</span>`);
}

// ── Sub-panels ─────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onSelect, layoutId }: {
  tabs: { id: string; label: string; icon: React.ElementType; badge?: number }[];
  active: string; onSelect: (id: string) => void; layoutId: string;
}) {
  return (
    <div className="flex items-center gap-0 px-2 shrink-0"
      style={{ borderBottom: `1px solid ${t.border}50`, background: `${t.surface}cc` }}>
      {tabs.map(({ id, label, icon: Icon, badge }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onSelect(id)}
            className="relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium cursor-pointer transition-all duration-500"
            style={{ color: isActive ? t.text : `${t.muted}80` }}>
            <Icon className="w-3 h-3"/>
            {label}
            {badge != null && badge > 0 && (
              <span className="text-[9px] px-1 rounded-full" style={{ background:`${t.primary}18`, color:t.primary }}>{badge}</span>
            )}
            {isActive && (
              <motion.div layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ background: t.primary }}
                transition={{ type:"spring", stiffness:500, damping:35 }}/>
            )}
          </button>
        );
      })}
    </div>
  );
}

function DescriptionPanel() {
  return (
    <div className="h-full overflow-y-auto px-7 py-6 space-y-5">
      {/* Title + badges */}
      <div className="space-y-2">
        <h1 className="text-[20px] font-semibold tracking-tight">{PROBLEM.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background:`${t.amber}18`, color:t.amber }}>
            {PROBLEM.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: t.raised, color: t.muted }}>Write Code</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: t.raised, color: t.muted }}>{PROBLEM.concept}</span>
        </div>
      </div>
      <div className="h-px" style={{ background:`${t.border}50` }}/>
      {/* Description */}
      <p className="text-[13px] leading-relaxed" style={{ color: t.sub }}>{PROBLEM.description}</p>
      {/* Function signature */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color:`${t.muted}80` }}>
          Function Signature
        </p>
        <pre className="rounded-lg p-3.5 text-[12px] font-mono overflow-x-auto"
          style={{ background: t.raised, color: t.text }}>
          {PROBLEM.functionSignature}
        </pre>
      </div>
      {/* Examples */}
      <div className="space-y-3">
        {PROBLEM.examples.map((ex, i) => (
          <motion.div key={i} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
            transition={{ ...SP, delay: i * 0.05 }}
            className="rounded-lg p-3.5 space-y-2"
            style={{ background: t.raised }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color:`${t.muted}80` }}>
              Example {i + 1}
            </p>
            <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
              <p><span style={{ color:`${t.muted}80` }}>Input: </span><span style={{ color: t.text }}>{ex.input}</span></p>
              <p><span style={{ color:`${t.muted}80` }}>Output: </span><span style={{ color: t.primary }}>{ex.output}</span></p>
            </div>
            {ex.explanation && (
              <p className="text-[11px] leading-relaxed" style={{ color:`${t.muted}90` }}>{ex.explanation}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TestCasesContent() {
  return (
    <div className="p-4 space-y-2">
      {TEST_RESULTS.map((tc, i) => (
        <motion.div key={i} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          transition={{ ...SP, delay: i * 0.05 }}
          className="rounded-lg p-3 space-y-1.5"
          style={{ background: tc.passed ? `${t.primary}08` : `#EF444408`, border:`1px solid ${tc.passed ? t.primary : "#EF4444"}18` }}>
          <div className="flex items-center gap-2">
            {tc.passed
              ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: t.primary }}/>
              : <XCircle      className="w-3.5 h-3.5 shrink-0" style={{ color:"#EF4444" }}/>
            }
            <span className="text-[11px] font-semibold" style={{ color: tc.passed ? t.primary : "#EF4444" }}>{tc.label}</span>
            <span className="text-[11px]" style={{ color:`${t.muted}80` }}>{tc.input}</span>
          </div>
          {!tc.passed && (
            <div className="pl-5 space-y-0.5 font-mono text-[11px]">
              <p><span style={{ color:`${t.muted}60` }}>Expected: </span><span style={{ color: t.primary }}>{tc.expected}</span></p>
              <p><span style={{ color:`${t.muted}60` }}>Got: </span><span style={{ color:"#EF4444" }}>{tc.actual}</span></p>
            </div>
          )}
        </motion.div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-mono" style={{ color:`${t.muted}70` }}>
          {TEST_RESULTS.filter(r => r.passed).length} / {TEST_RESULTS.length} passed
        </span>
      </div>
    </div>
  );
}

function ReviewContent() {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="p-4 space-y-4">
      {/* Score + summary */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center text-[15px] font-bold font-mono shrink-0"
          style={{ background:`${scoreColor(REVIEW.score)}18`, color: scoreColor(REVIEW.score) }}>
          {REVIEW.score}
        </div>
        <p className="text-[13px] leading-snug flex-1" style={{ color: t.sub }}>{REVIEW.summary}</p>
      </div>
      {/* Attribute bars */}
      <div className="grid grid-cols-2 gap-2">
        {(["correctness","design","clarity","efficiency"] as const).map(key => {
          const val = REVIEW.attributes[key];
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const color = scoreColor(val);
          return (
            <div key={key} className="rounded-lg px-3 py-2 space-y-1.5" style={{ background: t.raised }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color:`${t.muted}80` }}>{label}</span>
                <span className="text-[11px] font-bold font-mono" style={{ color }}>{val}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background:`${t.border}60` }}>
                <motion.div className="h-full rounded-full" style={{ background: color }}
                  initial={{ width:0 }} animate={{ width:`${val}%` }}
                  transition={{ type:"spring", stiffness:120, damping:20, delay:0.1 }}/>
              </div>
            </div>
          );
        })}
      </div>
      {/* Strengths */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.primary }}>Strengths</p>
        <div className="space-y-1">
          {REVIEW.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: t.primary }}/>
              <span style={{ color:`${t.sub}cc` }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Issues */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color:"#EF4444" }}>Issues</p>
        <div className="space-y-1">
          {REVIEW.issues.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              <XCircle className="w-3 h-3 shrink-0 mt-0.5" style={{ color:"#EF4444" }}/>
              <span style={{ color:`${t.sub}cc` }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Next steps */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.amber }}>Next Steps</p>
        <div className="space-y-1">
          {REVIEW.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              <ArrowRightIcon className="w-3 h-3 shrink-0 mt-0.5" style={{ color: t.amber }}/>
              <span style={{ color:`${t.sub}cc` }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HintsContent() {
  return (
    <div className="p-4 space-y-3">
      {HINTS.map((h, i) => (
        <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ ...SP, delay: i * 0.05 }}
          className="rounded-lg p-3 space-y-1.5"
          style={{ background: t.raised }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color:`${t.muted}80` }}>Hint {h.hint_number}</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background:`${t.primary}18`, color:t.primary }}>{h.level}</span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: t.sub }}>{h.hint}</p>
        </motion.div>
      ))}
      <motion.button whileTap={{ scale:0.97 }} transition={SP2}
        className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500"
        style={{ color: t.primary, background:`${t.primary}12` }}>
        <Lightbulb className="w-3 h-3"/> Get Another Hint
      </motion.button>
    </div>
  );
}

function SolutionContent() {
  return (
    <div className="p-4 space-y-3">
      <p className="text-[12px] leading-relaxed" style={{ color:`${t.muted}90` }}>
        View the model solution with a step-by-step explanation of the approach, key insights, and complexity analysis.
      </p>
      <motion.button whileTap={{ scale:0.97 }} transition={SP2}
        className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500"
        style={{ color: t.primary, background:`${t.primary}12` }}>
        <BookOpen className="w-3 h-3"/> View Solution
      </motion.button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function V2ChallengePage() {
  const [leftTab,    setLeftTab]    = useState<"description"|"notes">("description");
  const [bottomTab,  setBottomTab]  = useState<"tests"|"hints"|"review"|"solution">("review");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [code] = useState(STARTER_CODE);

  return (
    <div className="dark flex h-screen overflow-hidden font-sans p-2 gap-2"
      style={{ background: t.bg, color: t.text }}>

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
                <motion.button key={label} whileTap={{ scale: 0.96 }} transition={SP}
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
              style={{ background: t.amber, color: "#000" }}>3</div>
          </div>
          <div className="px-2 py-1 rounded-md text-[8px] font-bold tracking-wide cursor-pointer transition-all duration-500"
            style={{ background:`${t.border}60`, color:t.sub, border:`1px solid ${t.border}` }}>FREE</div>
        </div>
      </aside>

      {/* ── Main IDE ── */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-lg"
        style={{ background: `${t.surface}40` }}>

        {/* Top bar */}
        <div className="flex items-center justify-between h-11 px-4 shrink-0"
          style={{ borderBottom:`1px solid ${t.border}40` }}>
          {/* Left — breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: t.muted }}>
            <button className="hover:text-white cursor-pointer transition-all duration-500">Python Mastery</button>
            <span style={{ color:`${t.border}80` }}>/</span>
            <button className="hover:text-white cursor-pointer transition-all duration-500">Advanced DS</button>
            <span style={{ color:`${t.border}80` }}>/</span>
            <span style={{ color: t.text }}>{PROBLEM.title}</span>
          </div>
          {/* Right */}
        <div className="flex items-center gap-2.5">
          {/* Status + score */}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ background:`${t.primary}14`, color: t.primary }}>In progress</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color:`${t.muted}60` }}>Score</span>
            <span className="text-[12px] font-mono font-semibold tabular-nums" style={{ color: t.amber }}>
              {PROBLEM.score}%
            </span>
          </div>
          <div className="w-px h-4" style={{ background:`${t.border}60` }}/>
          {/* Nav */}
          <button className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded cursor-pointer transition-all duration-500"
            style={{ color: t.muted, border:`1px solid ${t.border}80` }}>
            <ChevronLeft className="w-3.5 h-3.5"/> Prev
          </button>
          <span className="text-[11px] font-mono tabular-nums" style={{ color:`${t.muted}60` }}>2 / 4</span>
          <button className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded cursor-pointer transition-all duration-500"
            style={{ color: t.muted, border:`1px solid ${t.border}80` }}>
            Next <ChevronRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* ── IDE body ── */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">

        {/* ── Left panel ── */}
        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="flex flex-col h-full overflow-hidden">
            <TabBar layoutId="left-tab"
              tabs={[
                { id:"description", label:"Description", icon:FileText },
                { id:"notes",       label:"Notes",       icon:StickyNote },
              ]}
              active={leftTab} onSelect={id => setLeftTab(id as any)}/>
            <div className="flex-1 overflow-hidden">
              {leftTab === "description" && <DescriptionPanel/>}
              {leftTab === "notes" && (
                <div className="h-full p-4">
                  <textarea
                    className="w-full h-full resize-none text-[13px] leading-relaxed outline-none"
                    style={{ background:"transparent", color: t.sub, fontFamily:"inherit" }}
                    placeholder="Add your notes here…"
                    defaultValue="MinHeap invariant: parent ≤ both children at all times.&#10;&#10;Key insight: after extract_min, put the last element at root and sift down — don't sift up."
                  />
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-[3px] cursor-col-resize transition-colors duration-200"
          style={{ background:`${t.border}60` }}/>

        {/* ── Right panel ── */}
        <ResizablePanel defaultSize={55} minSize={25}>
          <ResizablePanelGroup orientation="vertical" className="h-full">

            {/* Code editor */}
            <ResizablePanel defaultSize={62} minSize={20}>
              <div className="flex flex-col h-full min-h-0">
                {/* Editor header */}
                <div className="flex items-center justify-between px-3 h-9 shrink-0"
                  style={{ background:`${t.surface}cc`, borderBottom:`1px solid ${t.border}50` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium" style={{ color: t.muted }}>Python</span>
                    <span className="text-[10px] font-mono" style={{ color:`${t.muted}50` }}>main.py</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded cursor-pointer transition-all duration-500"
                      style={{ color:`${t.muted}70` }}>
                      <RotateCcw className="w-3.5 h-3.5"/>
                    </button>
                    <motion.button whileTap={{ scale:0.97 }} transition={SP2}
                      className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded cursor-pointer transition-all duration-500"
                      style={{ color: t.text, border:`1px solid ${t.border}80` }}>
                      <Play className="w-3 h-3"/> Run
                    </motion.button>
                    <motion.button whileTap={{ scale:0.97 }} transition={SP2}
                      className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded cursor-pointer transition-all duration-500"
                      style={{ background: t.primary, color:"#fff" }}>
                      <Send className="w-3 h-3"/> Submit
                    </motion.button>
                  </div>
                </div>
                {/* Code area */}
                <div className="flex-1 overflow-auto" style={{ background: t.bg }}>
                  <div className="flex min-h-full">
                    {/* Line numbers */}
                    <div className="select-none text-right pr-4 pl-4 pt-4 shrink-0"
                      style={{ color:`${t.muted}30`, fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:13, lineHeight:"1.7" }}>
                      {code.split("\n").map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Code */}
                    <pre className="flex-1 pt-4 pr-6 pb-4 overflow-x-auto"
                      style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:13, lineHeight:"1.7", color: t.text, margin:0 }}
                      dangerouslySetInnerHTML={{ __html: highlight(code) }}
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="h-[3px] cursor-row-resize transition-colors duration-200"
              style={{ background:`${t.border}60` }}/>

            {/* Bottom panel */}
            <ResizablePanel defaultSize={38} minSize={15}>
              <div className="flex flex-col h-full overflow-hidden">
                <TabBar layoutId="bottom-tab"
                  tabs={[
                    { id:"tests",    label:"Test Cases", icon:FlaskConical },
                    { id:"hints",    label:"Hints",      icon:Lightbulb,   badge: HINTS.length },
                    { id:"review",   label:"AI Review",  icon:Bot },
                    { id:"solution", label:"Solution",   icon:BookOpen },
                  ]}
                  active={bottomTab} onSelect={id => setBottomTab(id as any)}/>
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {bottomTab === "tests"    && <motion.div key="tests"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><TestCasesContent/></motion.div>}
                    {bottomTab === "hints"    && <motion.div key="hints"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><HintsContent/></motion.div>}
                    {bottomTab === "review"   && <motion.div key="review"   initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><ReviewContent/></motion.div>}
                    {bottomTab === "solution" && <motion.div key="solution" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><SolutionContent/></motion.div>}
                  </AnimatePresence>
                </div>
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>

      </ResizablePanelGroup>
      </div>{/* end main wrapper */}
    </div>
  );
}
