"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

const PRESETS = [
  { label: "Python zen", text: "beautiful is better than ugly explicit is better than implicit simple is better than complex" },
  { label: "Pangram", text: "the quick brown fox jumps over the lazy dog and the lazy dog slept all day" },
  { label: "Code review", text: "this code is clean this logic is clear this test is missing this name is unclear" },
  { label: "Bug report", text: "error error warning error null null undefined error warning null" },
];

type Mode = "words" | "chars";

function countWords(text: string): [string, number][] {
  const freq: Record<string, number> = {};
  for (const w of text.split(/\s+/).filter(Boolean)) {
    freq[w] = (freq[w] ?? 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
}

function countChars(text: string): [string, number][] {
  const freq: Record<string, number> = {};
  for (const c of text.replace(/\s/g, "")) {
    freq[c] = (freq[c] ?? 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12);
}

export function InteractiveCounter() {
  const [activePreset, setActivePreset] = useState(PRESETS[0].label);
  const [mode, setMode] = useState<Mode>("words");

  const text = PRESETS.find((p) => p.label === activePreset)!.text;

  const counts = useMemo(
    () => (mode === "words" ? countWords(text) : countChars(text)),
    [text, mode]
  );

  const max = counts[0]?.[1] ?? 1;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Counter Explorer
        </span>
        <span className="text-[10px] font-mono text-brand-text-subtle">
          from collections import Counter
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a text
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

      <div className="flex gap-1.5 mb-5">
        {(["words", "chars"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
              mode === m
                ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
            }`}
          >
            {m}
          </motion.button>
        ))}
      </div>

      <div className="font-mono text-[11px] text-brand-text-subtle bg-brand-surface/60 rounded-lg px-3 py-2 mb-4">
        Counter({mode === "words" ? "text.split()" : "text"}).most_common({mode === "words" ? 10 : 12})
      </div>

      <div className="space-y-1.5">
        <AnimatePresence mode="wait">
          {counts.map(([item, count]) => (
            <motion.div
              key={item + mode}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] font-mono text-brand-text-muted w-20 text-right shrink-0 truncate">
                {item}
              </span>
              <div className="flex-1 h-5 bg-brand-surface rounded-sm overflow-hidden">
                <motion.div
                  className="h-full rounded-sm bg-brand-primary/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ ...SPRING, delay: 0.05 }}
                />
              </div>
              <span className="text-[11px] font-mono text-brand-primary w-4 shrink-0">
                {count}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
