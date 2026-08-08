"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Cluster = "animals" | "royalty" | "fruits" | "vehicles" | "numbers";

const WORDS: Record<string, { pos: [number, number]; cluster: Cluster }> = {
  cat: { pos: [-6.2, 4.6], cluster: "animals" },
  kitten: { pos: [-6.5, 4.9], cluster: "animals" },
  dog: { pos: [-5.6, 3.6], cluster: "animals" },
  puppy: { pos: [-5.9, 3.9], cluster: "animals" },
  lion: { pos: [-4.3, 5.6], cluster: "animals" },
  king: { pos: [5.4, 5.9], cluster: "royalty" },
  queen: { pos: [5.4, 4.1], cluster: "royalty" },
  man: { pos: [4.6, 5.9], cluster: "royalty" },
  woman: { pos: [4.6, 4.1], cluster: "royalty" },
  prince: { pos: [5.9, 6.3], cluster: "royalty" },
  princess: { pos: [5.9, 3.7], cluster: "royalty" },
  apple: { pos: [-5.2, -4.8], cluster: "fruits" },
  banana: { pos: [-4.7, -5.3], cluster: "fruits" },
  orange: { pos: [-5.4, -5.4], cluster: "fruits" },
  car: { pos: [6.3, -4.7], cluster: "vehicles" },
  truck: { pos: [5.8, -5.4], cluster: "vehicles" },
  one: { pos: [-0.3, -6.2], cluster: "numbers" },
  two: { pos: [0, -6.4], cluster: "numbers" },
  three: { pos: [0.3, -6.6], cluster: "numbers" },
};

const CLUSTER_COLOR: Record<Cluster, string> = {
  animals: "var(--brand-chart-1)",
  royalty: "var(--brand-chart-2)",
  fruits: "var(--brand-chart-3)",
  vehicles: "var(--brand-chart-4)",
  numbers: "var(--brand-chart-5)",
};

function cosine(a: [number, number], b: [number, number]): number {
  const dot = a[0] * b[0] + a[1] * b[1];
  const na = Math.hypot(a[0], a[1]);
  const nb = Math.hypot(b[0], b[1]);
  return dot / (na * nb);
}

function nearestNeighbors(word: string, k = 3) {
  const v = WORDS[word].pos;
  return Object.entries(WORDS)
    .filter(([w]) => w !== word)
    .map(([w, data]) => ({ word: w, sim: cosine(v, data.pos) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}

const ANALOGY_RESULT: [number, number] = [
  WORDS.king.pos[0] - WORDS.man.pos[0] + WORDS.woman.pos[0],
  WORDS.king.pos[1] - WORDS.man.pos[1] + WORDS.woman.pos[1],
];

function project([x, y]: [number, number]) {
  return { cx: x, cy: -y };
}

export function EmbeddingSpace() {
  const [mode, setMode] = useState<"explore" | "analogy">("explore");
  const [selected, setSelected] = useState("kitten");

  const neighbors = useMemo(() => nearestNeighbors(selected), [selected]);
  const neighborWords = new Set(neighbors.map((n) => n.word));

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-text">A toy 2D embedding space</span>
        <span className="text-[9px] text-brand-text-subtle">19 hand-placed vectors, not a trained model</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setMode("explore")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none ${
              mode === "explore" ? "bg-brand-primary text-white" : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
            }`}
          >
            Explore neighbors
          </button>
          <button
            type="button"
            onClick={() => setMode("analogy")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none ${
              mode === "analogy" ? "bg-brand-primary text-white" : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
            }`}
          >
            Vector arithmetic
          </button>
        </div>

        <svg viewBox="-8 -8 16 16" className="w-full aspect-square bg-brand-surface/40 rounded-lg">
          {Object.entries(WORDS).map(([word, data]) => {
            const { cx, cy } = project(data.pos);
            const isSelected = mode === "explore" && word === selected;
            const isNeighbor = mode === "explore" && neighborWords.has(word);
            const isAnalogyWord = mode === "analogy" && ["king", "man", "woman", "queen"].includes(word);
            const dim = mode === "explore" && !isSelected && !isNeighbor;
            return (
              <g key={word} opacity={dim ? 0.25 : 1}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected || isAnalogyWord ? 0.32 : 0.22}
                  fill={CLUSTER_COLOR[data.cluster]}
                  stroke={isSelected ? "var(--brand-primary)" : "none"}
                  strokeWidth={0.12}
                  className={mode === "explore" ? "cursor-pointer" : ""}
                  onClick={() => mode === "explore" && setSelected(word)}
                />
                <text
                  x={cx}
                  y={cy - 0.45}
                  fontSize={0.42}
                  textAnchor="middle"
                  className="fill-brand-text font-mono select-none pointer-events-none"
                >
                  {word}
                </text>
              </g>
            );
          })}

          {mode === "analogy" && (
            <>
              <line
                x1={project(WORDS.man.pos).cx}
                y1={project(WORDS.man.pos).cy}
                x2={project(WORDS.king.pos).cx}
                y2={project(WORDS.king.pos).cy}
                stroke="var(--brand-primary)"
                strokeWidth={0.08}
                strokeDasharray="0.2 0.15"
              />
              <line
                x1={project(WORDS.woman.pos).cx}
                y1={project(WORDS.woman.pos).cy}
                x2={project(ANALOGY_RESULT).cx}
                y2={project(ANALOGY_RESULT).cy}
                stroke="var(--brand-primary)"
                strokeWidth={0.08}
                strokeDasharray="0.2 0.15"
              />
              <circle
                cx={project(ANALOGY_RESULT).cx}
                cy={project(ANALOGY_RESULT).cy}
                r={0.5}
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth={0.1}
              />
            </>
          )}
        </svg>

        {mode === "explore" ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(WORDS).map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => setSelected(word)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono cursor-pointer transition-all duration-500 outline-none ${
                    word === selected
                      ? "bg-brand-primary text-white"
                      : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="text-[11px] text-brand-text-muted"
            >
              Nearest to <span className="font-mono text-brand-text font-semibold">{selected}</span>:{" "}
              {neighbors.map((n, i) => (
                <span key={n.word}>
                  {i > 0 && ", "}
                  <span className="font-mono text-brand-text">{n.word}</span>{" "}
                  <span className="text-brand-text-subtle">({n.sim.toFixed(3)})</span>
                </span>
              ))}
            </motion.div>
          </div>
        ) : (
          <p className="text-[11px] text-brand-text-muted">
            <span className="font-mono text-brand-text">king - man + woman</span> lands, in this
            toy space, at exactly the same point as{" "}
            <span className="font-mono text-brand-text font-semibold">queen</span>. The circled
            point on the plot is the arithmetic result.
          </p>
        )}
      </div>
    </div>
  );
}
