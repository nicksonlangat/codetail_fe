"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";

type Stage = {
  id: string;
  label: string;
  kind: "flow" | "residual";
  description: string;
};

const STAGES: Stage[] = [
  {
    id: "input",
    label: "Input embedding",
    kind: "flow",
    description:
      "Token and position vectors entering the block, the same vectors the Embeddings and Positional Encoding articles build.",
  },
  {
    id: "ln1",
    label: "Layer norm",
    kind: "flow",
    description:
      "Rescales every token's vector to a stable mean and variance before attention runs, so attention sees consistent-scale inputs no matter how deep in the stack this block sits.",
  },
  {
    id: "attn",
    label: "Multi-head attention",
    kind: "flow",
    description:
      "Every token gathers information from every other token, computed independently across several learned attention heads, then concatenated back together.",
  },
  {
    id: "res1",
    label: "Add residual",
    kind: "residual",
    description:
      "The block's original input is added back onto attention's output. The sublayer only has to learn what to change, not reconstruct the whole vector from scratch.",
  },
  {
    id: "ln2",
    label: "Layer norm",
    kind: "flow",
    description:
      "Normalizes again, the same job as the first layer norm, this time preparing the vector for the feedforward sublayer.",
  },
  {
    id: "ffn",
    label: "Feedforward",
    kind: "flow",
    description:
      "Expands each token's vector to a wider hidden size, applies a nonlinearity, then projects back down. This is where the model actually processes what attention gathered.",
  },
  {
    id: "res2",
    label: "Add residual",
    kind: "residual",
    description:
      "The feedforward sublayer's input is added back onto its output, the same skip-connection pattern used after attention.",
  },
  {
    id: "output",
    label: "Output",
    kind: "flow",
    description:
      "One vector per token, the same shape it came in with, ready for the next identical block or the final prediction layer.",
  },
];

export function TransformerBlockDiagram() {
  const [selectedId, setSelectedId] = useState<string>("attn");
  const selected = STAGES.find((s) => s.id === selectedId) ?? STAGES[0];

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">
          A transformer block, top to bottom
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="w-full flex flex-col items-center">
              <motion.button
                type="button"
                onClick={() => setSelectedId(stage.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`w-full px-4 py-2.5 rounded-lg text-[12px] font-medium cursor-pointer outline-none transition-all duration-500 border ${
                  stage.kind === "residual" ? "border-dashed" : "border-solid"
                } ${
                  selectedId === stage.id
                    ? "border-brand-primary bg-brand-primary/10 text-brand-text"
                    : "border-brand-border bg-brand-surface/40 text-brand-text-muted hover:text-brand-text hover:border-brand-primary/40"
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {stage.kind === "residual" && <Plus className="size-3" />}
                  {stage.label}
                </span>
              </motion.button>
              {i < STAGES.length - 1 && (
                <ChevronDown className="size-3.5 text-brand-text-subtle my-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[64px] bg-brand-surface/40 rounded-lg px-4 py-3 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={selected.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-[13px] text-brand-text leading-relaxed"
            >
              <span className="font-semibold">{selected.label}.</span> {selected.description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
