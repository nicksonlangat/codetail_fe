"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

const FRUITS = ["apple", "banana", "cherry", "date", "elderberry"];
const PRICES = [1.20, 0.50, 3.00, 4.50, 6.00];

type Mode = {
  label: string;
  code: string;
  headers: string[];
  rows: string[][];
};

const MODES: Mode[] = [
  {
    label: "for item",
    code: "for fruit in fruits:",
    headers: ["fruit"],
    rows: FRUITS.map((f) => [f]),
  },
  {
    label: "enumerate",
    code: "for i, fruit in enumerate(fruits):",
    headers: ["i", "fruit"],
    rows: FRUITS.map((f, i) => [String(i), f]),
  },
  {
    label: "zip",
    code: "for fruit, price in zip(fruits, prices):",
    headers: ["fruit", "price"],
    rows: FRUITS.map((f, i) => [f, PRICES[i].toFixed(2)]),
  },
  {
    label: "enumerate + zip",
    code: "for i, (fruit, price) in enumerate(zip(fruits, prices)):",
    headers: ["i", "fruit", "price"],
    rows: FRUITS.map((f, i) => [String(i), f, PRICES[i].toFixed(2)]),
  },
];

export function InteractiveEnumerateZip() {
  const [activeLabel, setActiveLabel] = useState(MODES[0].label);
  const mode = MODES.find((m) => m.label === activeLabel)!;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block mb-4">
        Iteration Mode Explorer
      </span>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a pattern
        </span>
        <div className="flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <motion.button
              key={m.label}
              onClick={() => setActiveLabel(m.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activeLabel === m.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {m.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <div className="font-mono text-[12px] text-brand-primary bg-brand-primary/8 border border-brand-primary/15 rounded-lg px-3 py-2 mb-4">
            {mode.code}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] font-mono">
              <thead>
                <tr>
                  <th className="text-left text-[9px] uppercase tracking-wider text-brand-text-subtle pb-2 pr-4 font-medium w-8">
                    iter
                  </th>
                  {mode.headers.map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] uppercase tracking-wider text-brand-text-subtle pb-2 pr-6 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mode.rows.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING, delay: i * 0.04 }}
                    className="border-t border-brand-border/30"
                  >
                    <td className="py-1.5 pr-4 text-brand-text-subtle">{i}</td>
                    {row.map((cell, j) => (
                      <td key={j} className="py-1.5 pr-6 text-brand-text/80">
                        {j === 0 && mode.headers[0] === "i" ? (
                          <span className="text-brand-warning">{cell}</span>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
