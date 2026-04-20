"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const PRESETS = [
  {
    label: "Poll votes",
    items: ["yes", "no", "yes", "yes", "maybe", "no", "yes", "maybe", "no"],
  },
  {
    label: "Tags",
    items: ["python", "code", "python", "tutorial", "code", "python", "tips", "tutorial"],
  },
  {
    label: "Numbers",
    items: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5].map(String),
  },
  {
    label: "Log levels",
    items: ["INFO", "ERROR", "INFO", "WARN", "ERROR", "ERROR", "INFO", "DEBUG"],
  },
];

export function InteractiveSetBuilder() {
  const [activePreset, setActivePreset] = useState(PRESETS[0].label);

  const preset = PRESETS.find((p) => p.label === activePreset)!;
  const setItems = [...new Set(preset.items)];
  const dupCount = preset.items.length - setItems.length;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Deduplication Explorer
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          set(items) removes duplicates
        </span>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick a list
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActivePreset(p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                activePreset === p.label
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* List row */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground/40">
            list — {preset.items.length} items
          </span>
          {dupCount > 0 && (
            <span className="text-[10px] font-mono text-red-400/70">
              {dupCount} duplicate{dupCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence mode="wait">
            {preset.items.map((item, i) => {
              const isDup = preset.items.indexOf(item) !== i;
              return (
                <motion.div
                  key={`${item}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ ...spring, delay: i * 0.03 }}
                  className={cn(
                    "px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all duration-300",
                    isDup
                      ? "border-red-400/20 bg-red-400/5 text-red-400/60 line-through"
                      : "border-border bg-muted text-foreground/70"
                  )}
                >
                  {item}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-2 my-4">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-[10px] font-mono text-primary">set(items)</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* Set row */}
      <div>
        <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">
          set — {setItems.length} unique items
        </span>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence mode="wait">
            {setItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ ...spring, delay: i * 0.04 }}
                className="px-2.5 py-1 rounded-md border border-primary/25 bg-primary/8 text-[11px] font-mono text-primary"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {dupCount > 0 && (
        <p className="text-[11px] text-muted-foreground/50 font-mono mt-4">
          {preset.items.length} items in → {setItems.length} items out — {dupCount} removed
        </p>
      )}
    </div>
  );
}
