"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Item = { id: number; original: number };
const NUMS: Item[] = [1, 2, 3, 4, 5].map((v, i) => ({ id: i, original: v }));

type Transform = { label: string; code: string; apply: (v: number) => string };

const TRANSFORMS: Transform[] = [
  { label: "x * 2",  code: "[x * 2 for x in nums]",  apply: (v) => String(v * 2) },
  { label: "x ** 2", code: "[x ** 2 for x in nums]",  apply: (v) => String(v ** 2) },
  { label: "x + 10", code: "[x + 10 for x in nums]",  apply: (v) => String(v + 10) },
  { label: "str(x)", code: "[str(x) for x in nums]",  apply: (v) => `'${v}'` },
];

export function InteractiveMap() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const transform = TRANSFORMS.find((t) => t.label === activeLabel) ?? null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Map Explorer
        </span>
        <AnimatePresence>
          {transform && (
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
          nums = [1, 2, 3, 4, 5]
        </span>
        <div className="flex flex-wrap gap-2">
          {NUMS.map((item) => (
            <div
              key={item.id}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[12px] font-mono transition-all duration-500",
                transform
                  ? "border-border/30 bg-secondary/10 text-muted-foreground/40"
                  : "border-border bg-secondary/30 text-foreground"
              )}
            >
              {item.original}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-border/40" />
        <AnimatePresence mode="wait">
          {transform ? (
            <motion.code
              key={transform.label}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded"
            >
              {transform.label}
            </motion.code>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-muted-foreground/40"
            >
              pick a transform below
            </motion.span>
          )}
        </AnimatePresence>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* Result row */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
        {NUMS.map((item) => {
          const display = transform ? transform.apply(item.original) : String(item.original);
          return (
            <motion.div
              key={item.id}
              layout
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[12px] font-mono",
                transform
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-foreground"
              )}
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

      {/* Chips */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Try it — pick a transform
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRANSFORMS.map((t) => (
            <motion.button
              key={t.label}
              onClick={() => setActiveLabel(activeLabel === t.label ? null : t.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                activeLabel === t.label
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Code */}
      <AnimatePresence>
        {transform && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <div className="text-[10px] text-muted-foreground mb-1">Comprehension</div>
              <AnimatePresence mode="wait">
                <motion.code
                  key={transform.label}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[12px] font-mono text-foreground"
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
