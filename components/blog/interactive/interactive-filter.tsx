"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type Item = { id: number; value: number };
const NUMS: Item[] = [1, 2, 3, 4, 5, 6, 7, 8].map((v, i) => ({ id: i, value: v }));

type Condition = { label: string; code: string; test: (v: number) => boolean };

const CONDITIONS: Condition[] = [
  { label: "x % 2 == 0", code: "[x for x in nums if x % 2 == 0]", test: (v) => v % 2 === 0 },
  { label: "x % 2 != 0", code: "[x for x in nums if x % 2 != 0]", test: (v) => v % 2 !== 0 },
  { label: "x > 4", code: "[x for x in nums if x > 4]", test: (v) => v > 4 },
  { label: "x < 5", code: "[x for x in nums if x < 5]", test: (v) => v < 5 },
];

export function InteractiveFilter() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const cond = CONDITIONS.find((c) => c.label === activeLabel) ?? null;
  const kept = cond ? NUMS.filter((i) => cond.test(i.value)) : NUMS;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Filter Explorer
        </span>
        <AnimatePresence>
          {cond && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActiveLabel(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-2">
        <span className="text-[10px] font-mono text-brand-text-subtle block mb-2">
          nums = [1, 2, 3, 4, 5, 6, 7, 8]
        </span>
        <div className="flex flex-wrap gap-2">
          {NUMS.map((item) => {
            const passes = cond ? cond.test(item.value) : null;
            return (
              <motion.div
                key={item.id}
                animate={{ opacity: passes === false ? 0.25 : 1, scale: passes === false ? 0.88 : 1 }}
                transition={SPRING}
                className={`px-3 py-1.5 rounded-lg border text-[12px] font-mono transition-all duration-500 ${
                  passes === true
                    ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning"
                    : "border-brand-border bg-brand-surface/50 text-brand-text"
                }`}
              >
                {item.value}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-brand-border/60" />
        <AnimatePresence mode="wait">
          {cond ? (
            <motion.code
              key={cond.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded"
            >
              if {cond.label}
            </motion.code>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-brand-text-subtle"
            >
              pick a condition below
            </motion.span>
          )}
        </AnimatePresence>
        <div className="h-px flex-1 bg-brand-border/60" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 min-h-10">
        <AnimatePresence mode="popLayout">
          {kept.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={SPRING}
              className={`px-3 py-1.5 rounded-lg border text-[12px] font-mono ${
                cond
                  ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning"
                  : "border-brand-border bg-brand-surface/50 text-brand-text"
              }`}
            >
              {item.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Try it, pick a condition
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((c) => (
            <motion.button
              key={c.label}
              onClick={() => setActiveLabel(activeLabel === c.label ? null : c.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activeLabel === c.label
                  ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {cond && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-surface/60 rounded-lg p-3 mt-4">
              <div className="text-[10px] text-brand-text-muted mb-1">Comprehension</div>
              <AnimatePresence mode="wait">
                <motion.code
                  key={cond.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[12px] font-mono text-brand-text"
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
