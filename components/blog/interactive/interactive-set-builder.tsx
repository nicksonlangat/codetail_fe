"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

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
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Deduplication Explorer
        </span>
        <span className="text-[10px] font-mono text-brand-text-subtle">
          set(items) removes duplicates
        </span>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a list
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActivePreset(p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activePreset === p.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-brand-text-subtle">
            list, {preset.items.length} items
          </span>
          {dupCount > 0 && (
            <span className="text-[10px] font-mono text-brand-destructive/70">
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
                  transition={{ ...SPRING, delay: i * 0.03 }}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all duration-300 ${
                    isDup
                      ? "border-brand-destructive/20 bg-brand-destructive/5 text-brand-destructive/60 line-through"
                      : "border-brand-border bg-brand-surface text-brand-text/70"
                  }`}
                >
                  {item}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 my-4">
        <div className="h-px flex-1 bg-brand-border/60" />
        <span className="text-[10px] font-mono text-brand-primary">set(items)</span>
        <div className="h-px flex-1 bg-brand-border/60" />
      </div>

      <div>
        <span className="text-[10px] font-mono text-brand-text-subtle mb-2 block">
          set, {setItems.length} unique items
        </span>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence mode="wait">
            {setItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ ...SPRING, delay: i * 0.04 }}
                className="px-2.5 py-1 rounded-md border border-brand-primary/25 bg-brand-primary/8 text-[11px] font-mono text-brand-primary"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {dupCount > 0 && (
        <p className="text-[11px] text-brand-text-muted font-mono mt-4">
          {preset.items.length} items in, {setItems.length} items out, {dupCount} removed
        </p>
      )}
    </div>
  );
}
