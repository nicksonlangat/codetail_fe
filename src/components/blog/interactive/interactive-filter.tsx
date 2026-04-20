"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Item = { id: number; value: number };
const NUMS: Item[] = [1, 2, 3, 4, 5, 6, 7, 8].map((v, i) => ({ id: i, value: v }));

type Condition = { label: string; code: string; test: (v: number) => boolean };

const CONDITIONS: Condition[] = [
  { label: "x % 2 == 0", code: "[x for x in nums if x % 2 == 0]", test: (v) => v % 2 === 0 },
  { label: "x % 2 != 0", code: "[x for x in nums if x % 2 != 0]", test: (v) => v % 2 !== 0 },
  { label: "x > 4",      code: "[x for x in nums if x > 4]",      test: (v) => v > 4 },
  { label: "x < 5",      code: "[x for x in nums if x < 5]",      test: (v) => v < 5 },
];

export function InteractiveFilter() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const cond = CONDITIONS.find((c) => c.label === activeLabel) ?? null;
  const kept = cond ? NUMS.filter((i) => cond.test(i.value)) : NUMS;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Filter Explorer
        </span>
        <AnimatePresence>
          {cond && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring}
              onClick={() => setActiveLabel(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input row */}
      <div className="mb-2">
        <span className="text-[10px] font-mono text-muted-foreground/50 block mb-2">
          nums = [1, 2, 3, 4, 5, 6, 7, 8]
        </span>
        <div className="flex flex-wrap gap-2">
          {NUMS.map((item) => {
            const passes = cond ? cond.test(item.value) : null;
            return (
              <motion.div
                key={item.id}
                animate={{ opacity: passes === false ? 0.25 : 1, scale: passes === false ? 0.88 : 1 }}
                transition={spring}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-[12px] font-mono transition-all duration-500",
                  passes === true
                    ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300"
                    : "border-border bg-secondary/30 text-foreground"
                )}
              >
                {item.value}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-border/40" />
        <AnimatePresence mode="wait">
          {cond ? (
            <motion.code
              key={cond.label}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded"
            >
              if {cond.label}
            </motion.code>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-muted-foreground/40"
            >
              pick a condition below
            </motion.span>
          )}
        </AnimatePresence>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* Result row */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
        <AnimatePresence mode="popLayout">
          {kept.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[12px] font-mono",
                cond
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300"
                  : "border-border bg-secondary/30 text-foreground"
              )}
            >
              {item.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chips */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Try it — pick a condition
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((c) => (
            <motion.button
              key={c.label}
              onClick={() => setActiveLabel(activeLabel === c.label ? null : c.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                activeLabel === c.label
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {c.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Code */}
      <AnimatePresence>
        {cond && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <div className="text-[10px] text-muted-foreground mb-1">Comprehension</div>
              <AnimatePresence mode="wait">
                <motion.code
                  key={cond.label}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[12px] font-mono text-foreground"
                >
                  {cond.code}
                </motion.code>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
