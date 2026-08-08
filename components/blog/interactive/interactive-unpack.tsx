"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type VarDef = { name: string; value: string; starred?: boolean; ignore?: boolean };

type Pattern = {
  label: string;
  code: string;
  tupleItems: string[];
  vars: VarDef[];
  note?: string;
};

const PATTERNS: Pattern[] = [
  {
    label: "Basic",
    code: "x, y = (3, 7)",
    tupleItems: ["3", "7"],
    vars: [
      { name: "x", value: "3" },
      { name: "y", value: "7" },
    ],
  },
  {
    label: "3-element",
    code: 'name, age, city = ("Alice", 30, "NYC")',
    tupleItems: ['"Alice"', "30", '"NYC"'],
    vars: [
      { name: "name", value: '"Alice"' },
      { name: "age", value: "30" },
      { name: "city", value: '"NYC"' },
    ],
  },
  {
    label: "Starred *",
    code: "first, *rest = (1, 2, 3, 4, 5)",
    tupleItems: ["1", "2", "3", "4", "5"],
    vars: [
      { name: "first", value: "1" },
      { name: "*rest", value: "[2, 3, 4, 5]", starred: true },
    ],
    note: "* collects all remaining items into a list",
  },
  {
    label: "Ignore _",
    code: '_, score, _ = ("Alice", 95, "NYC")',
    tupleItems: ['"Alice"', "95", '"NYC"'],
    vars: [
      { name: "_", value: '"Alice"', ignore: true },
      { name: "score", value: "95" },
      { name: "_", value: '"NYC"', ignore: true },
    ],
    note: "_ is a valid variable name, convention for values you don't need",
  },
  {
    label: "Swap",
    code: "a, b = b, a",
    tupleItems: ["b", "a"],
    vars: [
      { name: "a", value: "old b" },
      { name: "b", value: "old a" },
    ],
    note: "Python evaluates the right side first, creating a temporary tuple",
  },
];

export function InteractiveUnpack() {
  const [active, setActive] = useState<string | null>(null);
  const pattern = PATTERNS.find((p) => p.label === active) ?? null;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Unpacking Explorer
        </span>
        <AnimatePresence>
          {pattern && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActive(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a pattern
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActive(active === p.label ? null : p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                active === p.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {pattern ? (
          <motion.div
            key={pattern.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-mono text-[12px] text-brand-primary bg-brand-primary/8 border border-brand-primary/15 rounded-lg px-3 py-2 mb-5">
              {pattern.code}
            </div>

            <div className="mb-1">
              <span className="text-[10px] font-mono text-brand-text-subtle mb-2 block">tuple</span>
              <div className="flex flex-wrap gap-2">
                {pattern.tupleItems.map((val, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-lg border border-brand-border bg-brand-surface text-[12px] font-mono text-brand-text/70"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="h-px flex-1 bg-brand-border/60" />
              <span className="text-[10px] text-brand-primary font-mono">unpacks to</span>
              <div className="h-px flex-1 bg-brand-border/60" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-brand-text-subtle mb-2 block">variables</span>
              <div className="flex flex-wrap gap-2">
                {pattern.vars.map((v, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border text-[12px] font-mono px-3 py-1.5 ${
                      v.ignore
                        ? "border-brand-border/50 bg-brand-surface/60 text-brand-text-subtle"
                        : v.starred
                          ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning"
                          : "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                    }`}
                  >
                    <span className="text-[10px] block leading-tight opacity-60">{v.value}</span>
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {pattern.note && (
              <p className="text-[11px] text-brand-text-muted mt-4 italic">{pattern.note}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-20 flex items-center justify-center"
          >
            <span className="text-[12px] text-brand-text-subtle font-mono">
              pick a pattern above
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
