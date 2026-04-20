"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

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
      { name: "age",  value: "30" },
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
    note: "_ is a valid variable name — convention for values you don't need",
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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Unpacking Explorer
        </span>
        <AnimatePresence>
          {pattern && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring}
              onClick={() => setActive(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick a pattern
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActive(active === p.label ? null : p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                active === p.label
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
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
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-mono text-[12px] text-primary bg-primary/8 border border-primary/15 rounded-lg px-3 py-2 mb-5">
              {pattern.code}
            </div>

            <div className="mb-1">
              <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">tuple</span>
              <div className="flex flex-wrap gap-2">
                {pattern.tupleItems.map((val, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-lg border border-border bg-muted text-[12px] font-mono text-foreground/70"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] text-primary font-mono">unpacks to</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">variables</span>
              <div className="flex flex-wrap gap-2">
                {pattern.vars.map((v, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border text-[12px] font-mono px-3 py-1.5",
                      v.ignore
                        ? "border-border/30 bg-muted/40 text-muted-foreground/40"
                        : v.starred
                        ? "border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400"
                        : "border-primary/30 bg-primary/8 text-primary"
                    )}
                  >
                    <span className="text-[10px] block leading-tight opacity-60">{v.value}</span>
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {pattern.note && (
              <p className="text-[11px] text-muted-foreground/60 mt-4 italic">{pattern.note}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-20 flex items-center justify-center"
          >
            <span className="text-[12px] text-muted-foreground/30 font-mono">
              pick a pattern above
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
