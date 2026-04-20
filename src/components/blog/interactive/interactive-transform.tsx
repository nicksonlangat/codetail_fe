"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Item = { id: number; value: number };

const INITIAL: Item[] = [4, 2, 7, 1, 8, 3, 6, 5].map((v, i) => ({ id: i, value: v }));

type Category = "sort" | "filter" | "map";

type Op = {
  label: string;
  code: string;
  category: Category;
  apply: (items: Item[]) => Item[];
};

const OPS: Op[] = [
  {
    label: "sorted()",
    code: "result = sorted(nums)",
    category: "sort",
    apply: (items) => [...items].sort((a, b) => a.value - b.value),
  },
  {
    label: "sorted(reverse=True)",
    code: "result = sorted(nums, reverse=True)",
    category: "sort",
    apply: (items) => [...items].sort((a, b) => b.value - a.value),
  },
  {
    label: "reversed()",
    code: "result = list(reversed(nums))",
    category: "sort",
    apply: (items) => [...items].reverse(),
  },
  {
    label: "filter even",
    code: "result = [x for x in nums if x % 2 == 0]",
    category: "filter",
    apply: (items) => items.filter((item) => item.value % 2 === 0),
  },
  {
    label: "filter odd",
    code: "result = [x for x in nums if x % 2 != 0]",
    category: "filter",
    apply: (items) => items.filter((item) => item.value % 2 !== 0),
  },
  {
    label: "filter > 4",
    code: "result = [x for x in nums if x > 4]",
    category: "filter",
    apply: (items) => items.filter((item) => item.value > 4),
  },
  {
    label: "map ×2",
    code: "result = [x * 2 for x in nums]",
    category: "map",
    apply: (items) => items.map((item) => ({ ...item, value: item.value * 2 })),
  },
  {
    label: "map ²",
    code: "result = [x ** 2 for x in nums]",
    category: "map",
    apply: (items) => items.map((item) => ({ ...item, value: item.value ** 2 })),
  },
];

const ACTIVE_ITEM_CLASS: Record<Category, string> = {
  sort: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  filter: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  map: "border-primary/30 bg-primary/10 text-primary",
};

const CHIP_ACTIVE_CLASS: Record<Category, string> = {
  sort: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  filter: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  map: "border-primary/20 bg-primary/10 text-primary",
};

export function InteractiveTransform() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const selected = OPS.find((op) => op.label === activeLabel) ?? null;
  const result = selected ? selected.apply(INITIAL) : INITIAL;
  const resultStr = `[${result.map((i) => i.value).join(", ")}]`;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Transform Explorer
        </span>
        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
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
          nums = [4, 2, 7, 1, 8, 3, 6, 5]
        </span>
        <div className="flex flex-wrap gap-2">
          {INITIAL.map((item) => (
            <div
              key={item.id}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[12px] font-mono transition-all duration-500",
                selected
                  ? "border-border/30 bg-secondary/10 text-muted-foreground/40"
                  : "border-border bg-secondary/30 text-foreground"
              )}
            >
              {item.value}
            </div>
          ))}
        </div>
      </div>

      {/* Divider + active code */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-border/40" />
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.code
              key={selected.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded"
            >
              {selected.code}
            </motion.code>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-muted-foreground/40"
            >
              pick an operation below
            </motion.span>
          )}
        </AnimatePresence>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* Result row */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
        <AnimatePresence mode="popLayout">
          {result.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[12px] font-mono",
                selected
                  ? ACTIVE_ITEM_CLASS[selected.category]
                  : "border-border bg-secondary/30 text-foreground"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.value}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Operation chips */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Try it — pick an operation
        </span>
        <div className="flex flex-wrap gap-1.5">
          {OPS.map((op) => (
            <motion.button
              key={op.label}
              onClick={() => setActiveLabel(activeLabel === op.label ? null : op.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all duration-500 cursor-pointer",
                activeLabel === op.label
                  ? CHIP_ACTIVE_CLASS[op.category]
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {op.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Result code block */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <div className="text-[10px] text-muted-foreground mb-1">Result</div>
              <AnimatePresence mode="wait">
                <motion.code
                  key={resultStr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[12px] font-mono text-foreground"
                >
                  {resultStr}
                </motion.code>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
