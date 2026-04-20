"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };
const PRIMARY = "#1fad87";

const PRESETS = [
  { label: "Python zen", text: "beautiful is better than ugly explicit is better than implicit simple is better than complex" },
  { label: "Pangram",    text: "the quick brown fox jumps over the lazy dog and the lazy dog slept all day" },
  { label: "Code review",text: "this code is clean this logic is clear this test is missing this name is unclear" },
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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Counter Explorer
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          from collections import Counter
        </span>
      </div>

      {/* Preset chips */}
      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick a text
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

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-5">
        {(["words", "chars"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className={cn(
              "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
              mode === m
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-muted-foreground bg-secondary border-border hover:text-foreground"
            )}
          >
            {m}
          </motion.button>
        ))}
      </div>

      {/* Code line */}
      <div className="font-mono text-[11px] text-muted-foreground/50 bg-muted/50 rounded-lg px-3 py-2 mb-4">
        Counter({mode === "words" ? "text.split()" : "text"}).most_common({mode === "words" ? 10 : 12})
      </div>

      {/* Bar chart */}
      <div className="space-y-1.5">
        <AnimatePresence mode="wait">
          {counts.map(([item, count]) => (
            <motion.div
              key={item + mode}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] font-mono text-muted-foreground/70 w-20 text-right flex-shrink-0 truncate">
                {item}
              </span>
              <div className="flex-1 h-5 bg-muted/40 rounded-sm overflow-hidden">
                <motion.div
                  className="h-full rounded-sm"
                  style={{ backgroundColor: PRIMARY + "99" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ ...spring, delay: 0.05 }}
                />
              </div>
              <span className="text-[11px] font-mono text-primary w-4 flex-shrink-0">
                {count}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
