"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const MERGE_RULES: [string, string][] = [
  ["l", "o"], ["lo", "w"], ["n", "e"], ["ne", "w"], ["e", "s"], ["es", "t"],
  ["s", "t"], ["st", "r"], ["str", "a"], ["stra", "w"],
  ["b", "e"], ["be", "r"], ["ber", "r"], ["berr", "y"],
  ["e", "r"],
  ["t", "o"], ["to", "k"], ["tok", "e"], ["toke", "n"],
  ["i", "z"], ["a", "t"], ["at", "i"], ["ati", "o"], ["atio", "n"],
  ["u", "n"], ["be", "l"], ["bel", "i"], ["beli", "e"], ["belie", "v"],
  ["b", "l"], ["a", "bl"], ["abl", "e"],
];

const WORDS = ["lower", "newest", "strawberry", "unbelievable", "tokenization", "internationalization"];

function bpeSteps(word: string): string[][] {
  let symbols = word.split("");
  const steps: string[][] = [symbols.slice()];
  while (symbols.length > 1) {
    let bestRank = Infinity;
    let bestIdx = -1;
    for (let i = 0; i < symbols.length - 1; i++) {
      const rank = MERGE_RULES.findIndex(([a, b]) => a === symbols[i] && b === symbols[i + 1]);
      if (rank !== -1 && rank < bestRank) {
        bestRank = rank;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    symbols = [...symbols.slice(0, bestIdx), symbols[bestIdx] + symbols[bestIdx + 1], ...symbols.slice(bestIdx + 2)];
    steps.push(symbols.slice());
  }
  return steps;
}

export function BpeTokenizer() {
  const [word, setWord] = useState("strawberry");
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => bpeSteps(word), [word]);
  const atStart = stepIndex === 0;
  const atEnd = stepIndex === steps.length - 1;
  const current = steps[stepIndex];

  const handleWordChange = (w: string) => {
    setWord(w);
    setStepIndex(0);
  };

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Byte-pair merges, step by step</span>
        <span className="text-[9px] text-brand-text-subtle">toy 32-merge vocabulary, not a real tokenizer</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {WORDS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => handleWordChange(w)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                w === word
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="min-h-16 flex flex-wrap items-center gap-1.5 px-3 py-4 bg-brand-surface/40 rounded-lg">
          {current.map((symbol, i) => (
            <motion.span
              key={`${i}-${symbol}`}
              layout
              transition={SPRING}
              className="px-2 py-1 rounded-md bg-white border border-brand-border font-mono text-[13px] text-brand-text"
            >
              {symbol}
            </motion.span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-text-muted">
            {atEnd
              ? `Done: ${current.length} token${current.length === 1 ? "" : "s"}, ${steps.length - 1} merges applied`
              : `Step ${stepIndex} of ${steps.length - 1} merges`}
          </span>
          <div className="flex gap-1.5">
            <motion.button
              type="button"
              onClick={() => setStepIndex(0)}
              disabled={atStart}
              whileHover={atStart ? {} : { scale: 1.03 }}
              whileTap={atStart ? {} : { scale: 0.97 }}
              transition={SPRING}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium outline-none ${
                atStart
                  ? "bg-brand-surface text-brand-text-subtle cursor-not-allowed"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text cursor-pointer"
              }`}
            >
              Reset
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setStepIndex((s) => Math.min(s + 1, steps.length - 1))}
              disabled={atEnd}
              whileHover={atEnd ? {} : { scale: 1.03 }}
              whileTap={atEnd ? {} : { scale: 0.97 }}
              transition={SPRING}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium outline-none ${
                atEnd
                  ? "bg-brand-surface text-brand-text-subtle cursor-not-allowed"
                  : "bg-brand-primary text-white cursor-pointer"
              }`}
            >
              Merge next pair
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
