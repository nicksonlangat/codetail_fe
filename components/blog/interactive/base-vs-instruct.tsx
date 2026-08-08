"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Mode = "base" | "instruct";

type Example = {
  id: string;
  prompt: string;
  base: string;
  instruct: string;
};

const EXAMPLES: Example[] = [
  {
    id: "bread",
    prompt: "How do I bake bread?",
    base: "How do I bake bread? How do I bake cookies without a stand mixer? How do I make pizza dough at home? Reply Report Share this thread Related questions from last week...",
    instruct: "Mix flour, water, yeast, and salt into a dough. Let it rise for about an hour, shape it, let it rise again, then bake at 220C (425F) for 25 to 30 minutes until the crust is golden brown.",
  },
  {
    id: "haiku",
    prompt: "Write a haiku about the ocean.",
    base: "Write a haiku about the ocean. Write a haiku about the moon. Write a haiku about autumn leaves. Write a limerick about a cat. Submit your answers below by Friday.",
    instruct: "Endless blue expanse\nwaves whisper against the shore\nhorizon holds still",
  },
  {
    id: "lockpick",
    prompt: "How do I pick a lock?",
    base: "How do I pick a lock? Posted by u/curioushands, 3 years ago. Tension wrench in the bottom of the keyway, light pressure, then rake the pins until you feel them set. Works on most pin tumblers...",
    instruct: "I can't walk you through picking a lock you don't own. If you're locked out of your own home or car, a locksmith or your property manager can help.",
  },
];

export function BaseVsInstruct() {
  const [exampleId, setExampleId] = useState("bread");
  const [mode, setMode] = useState<Mode>("base");

  const example = EXAMPLES.find((e) => e.id === exampleId)!;
  const completion = mode === "base" ? example.base : example.instruct;

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">Base model vs. instruction-tuned model</span>
        <span className="text-[9px] text-brand-text-subtle">illustrative, not a live model</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setExampleId(e.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                e.id === exampleId
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {e.prompt}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 p-1 bg-brand-surface rounded-lg w-fit">
          {(["base", "instruct"] as Mode[]).map((m) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none ${
                mode === m
                  ? "bg-brand-primary text-white"
                  : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {m === "base" ? "Base model" : "Instruction-tuned model"}
            </motion.button>
          ))}
        </div>

        <div className="rounded-lg bg-brand-surface/40 border border-brand-border p-3.5 min-h-[92px]">
          <p className="text-[10px] uppercase tracking-wider text-brand-text-subtle mb-2">
            Completion of &ldquo;{example.prompt}&rdquo;
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${exampleId}-${mode}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={SPRING}
              className="text-[13px] font-mono text-brand-text whitespace-pre-line leading-relaxed"
            >
              {completion}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
