"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VALUES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];

type Target = 30 | 90 | 150;

const TREE_PATHS: Record<Target, { node: number; decision: string }[]> = {
  30: [
    { node: 80, decision: "30 < 80, go left" },
    { node: 40, decision: "30 < 40, go left" },
    { node: 20, decision: "30 > 20, go right" },
    { node: 30, decision: "Match found" },
  ],
  90: [
    { node: 80, decision: "90 > 80, go right" },
    { node: 120, decision: "90 < 120, go left" },
    { node: 100, decision: "90 < 100, go left" },
    { node: 90, decision: "Match found" },
  ],
  150: [
    { node: 80, decision: "150 > 80, go right" },
    { node: 120, decision: "150 > 120, go right" },
    { node: 140, decision: "150 > 140, go right" },
    { node: 150, decision: "Match found" },
  ],
};

const TREE_LEVELS = [
  [80],
  [40, 120],
  [20, 60, 100, 140],
  [10, 30, 50, 70, 90, 110, 130, 150],
];

export function BTreeExplorer() {
  const [target, setTarget] = useState<Target>(90);
  const [scanIdx, setScanIdx] = useState(-1);
  const [treeStep, setTreeStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function reset() {
    clearTimers();
    setScanIdx(-1);
    setTreeStep(-1);
    setRunning(false);
    setDone(false);
  }

  useEffect(() => { reset(); }, [target]);
  useEffect(() => () => clearTimers(), []);

  const path = TREE_PATHS[target];
  const foundIdx = VALUES.indexOf(target);
  const pathNodes = new Set(path.slice(0, treeStep + 1).map(p => p.node));
  const scanComps = scanIdx >= 0 ? scanIdx + 1 : 0;
  const treeComps = treeStep >= 0 ? treeStep + 1 : 0;

  function run() {
    clearTimers();
    setScanIdx(-1);
    setTreeStep(-1);
    setDone(false);
    setRunning(true);

    for (let i = 0; i <= foundIdx; i++) {
      const id = setTimeout(() => setScanIdx(i), i * 200);
      timers.current.push(id);
    }

    path.forEach((_, i) => {
      const id = setTimeout(() => {
        setTreeStep(i);
        if (i === path.length - 1) {
          setDone(true);
          setRunning(false);
        }
      }, i * 450 + 100);
      timers.current.push(id);
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8 not-prose space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Full Scan vs Index Lookup
        </span>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {([30, 90, 150] as Target[]).map(t => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-3 py-1 rounded-md text-[10px] font-mono font-medium cursor-pointer transition-all duration-500 ${
                target === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Search {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tree diagram */}
      <div>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          B-tree structure — 16 rows, height 4
        </p>
        <div className="space-y-2">
          {TREE_LEVELS.map((level, lvl) => (
            <div key={lvl} className="flex justify-center gap-1.5">
              {level.map(v => (
                <div
                  key={v}
                  className={`h-7 min-w-[34px] px-1 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 ${
                    pathNodes.has(v)
                      ? v === target && done
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/20 text-primary ring-1 ring-primary/40"
                      : "bg-muted text-muted-foreground/50"
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Full table scan</p>
            {scanComps > 0 && (
              <span className="text-[9px] font-mono font-bold text-orange-500">{scanComps} rows read</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {VALUES.map((v, i) => (
              <div
                key={v}
                className={`h-7 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-150 ${
                  i < scanIdx
                    ? "bg-orange-400/15 text-orange-400"
                    : i === scanIdx
                    ? v === target
                      ? "bg-primary text-primary-foreground"
                      : "bg-orange-400/40 text-orange-500 ring-1 ring-orange-400"
                    : "bg-muted/40 text-muted-foreground/30"
                }`}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">B-tree index</p>
            {treeComps > 0 && (
              <span className="text-[9px] font-mono font-bold text-primary">{treeComps} comparisons</span>
            )}
          </div>
          <div className="space-y-1.5">
            {path.map((step, i) => (
              <motion.div
                key={i}
                animate={treeStep >= i ? { opacity: 1 } : { opacity: 0.2 }}
                className={`p-2 rounded-lg border text-[10px] flex items-center justify-between transition-all duration-200 ${
                  treeStep >= i
                    ? step.decision === "Match found"
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-card"
                    : "border-border/20 bg-transparent"
                }`}
              >
                <span className="font-mono font-bold">{step.node}</span>
                <span className={step.decision === "Match found" ? "text-primary font-semibold" : "text-muted-foreground"}>
                  {step.decision}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Result summary */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-3 rounded-xl bg-orange-400/10 border border-orange-400/20 text-center">
              <p className="text-[24px] font-black font-mono text-orange-500">{foundIdx + 1}</p>
              <p className="text-[10px] text-muted-foreground">rows scanned (O(n))</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-[24px] font-black font-mono text-primary">{path.length}</p>
              <p className="text-[10px] text-muted-foreground">index comparisons (O(log n))</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={run}
          disabled={running}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {done ? "Run again" : running ? "Running..." : "Run comparison"}
        </motion.button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground font-medium cursor-pointer hover:bg-muted/50 transition-all duration-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
