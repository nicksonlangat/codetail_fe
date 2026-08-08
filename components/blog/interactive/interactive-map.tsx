"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type Item = { id: number; original: number };
const NUMS: Item[] = [1, 2, 3, 4, 5].map((v, i) => ({ id: i, original: v }));

type Transform = { label: string; code: string; apply: (v: number) => string };

const TRANSFORMS: Transform[] = [
  { label: "x * 2", code: "[x * 2 for x in nums]", apply: (v) => String(v * 2) },
  { label: "x ** 2", code: "[x ** 2 for x in nums]", apply: (v) => String(v ** 2) },
  { label: "x + 10", code: "[x + 10 for x in nums]", apply: (v) => String(v + 10) },
  { label: "str(x)", code: "[str(x) for x in nums]", apply: (v) => `'${v}'` },
];

export function InteractiveMap() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const transform = TRANSFORMS.find((t) => t.label === activeLabel) ?? null;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Map Explorer
        </span>
        <AnimatePresence>
          {transform && (
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
          nums = [1, 2, 3, 4, 5]
        </span>
        <div className="flex flex-wrap gap-2">
          {NUMS.map((item) => (
            <div
              key={item.id}
              className={`px-3 py-1.5 rounded-lg border text-[12px] font-mono transition-all duration-500 ${
                transform
                  ? "border-brand-border/50 bg-brand-surface/30 text-brand-text-subtle"
                  : "border-brand-border bg-brand-surface/50 text-brand-text"
              }`}
            >
              {item.original}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-brand-border/60" />
        <AnimatePresence mode="wait">
          {transform ? (
            <motion.code
              key={transform.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded"
            >
              {transform.label}
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
              pick a transform below
            </motion.span>
          )}
        </AnimatePresence>
        <div className="h-px flex-1 bg-brand-border/60" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 min-h-10">
        {NUMS.map((item) => {
          const display = transform ? transform.apply(item.original) : String(item.original);
          return (
            <motion.div
              key={item.id}
              layout
              className={`px-3 py-1.5 rounded-lg border text-[12px] font-mono ${
                transform
                  ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                  : "border-brand-border bg-brand-surface/50 text-brand-text"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={display}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                >
                  {display}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Try it, pick a transform
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRANSFORMS.map((t) => (
            <motion.button
              key={t.label}
              onClick={() => setActiveLabel(activeLabel === t.label ? null : t.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activeLabel === t.label
                  ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {transform && (
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
                  key={transform.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[12px] font-mono text-brand-text"
                >
                  {transform.code}
                </motion.code>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
