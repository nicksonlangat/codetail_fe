"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type CallPattern = {
  label: string;
  call: string;
  args: string[];
  kwargs: Record<string, string>;
};

const PATTERNS: CallPattern[] = [
  {
    label: "positional only",
    call: "func(1, 2, 3)",
    args: ["1", "2", "3"],
    kwargs: {},
  },
  {
    label: "keyword only",
    call: 'func(x=1, y=2, z="hi")',
    args: [],
    kwargs: { x: "1", y: "2", z: '"hi"' },
  },
  {
    label: "mixed",
    call: 'func(1, 2, z="hi")',
    args: ["1", "2"],
    kwargs: { z: '"hi"' },
  },
  {
    label: "unpack list",
    call: "func(*[10, 20, 30])",
    args: ["10", "20", "30"],
    kwargs: {},
  },
  {
    label: "unpack dict",
    call: 'func(**{"x": 1, "y": 2})',
    args: [],
    kwargs: { x: "1", y: "2" },
  },
  {
    label: "unpack both",
    call: 'func(*[1, 2], **{"z": 3})',
    args: ["1", "2"],
    kwargs: { z: "3" },
  },
];

export function InteractiveArgs() {
  const [active, setActive] = useState<string | null>(null);
  const pattern = PATTERNS.find((p) => p.label === active) ?? null;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          *args / **kwargs Explorer
        </span>
        <code className="text-[10px] font-mono text-brand-text-subtle">
          def func(*args, **kwargs)
        </code>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a call pattern
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActive(active === p.label ? null : p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                active === p.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {pattern ? (
          <motion.div
            key={pattern.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="font-mono text-[12px] text-brand-primary bg-brand-primary/8 border border-brand-primary/15 rounded-lg px-3 py-2 mb-4">
              {pattern.call}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-surface/60 rounded-lg p-3">
                <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-2">
                  args (tuple)
                </span>
                {pattern.args.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.args.map((a, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...SPRING, delay: i * 0.05 }}
                        className="px-2 py-0.5 rounded border border-brand-warning/25 bg-brand-warning/8 text-[11px] font-mono text-brand-warning"
                      >
                        {a}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-brand-text-subtle">( )</span>
                )}
              </div>

              <div className="bg-brand-surface/60 rounded-lg p-3">
                <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-2">
                  kwargs (dict)
                </span>
                {Object.keys(pattern.kwargs).length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {Object.entries(pattern.kwargs).map(([k, v], i) => (
                      <motion.div
                        key={k}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...SPRING, delay: i * 0.05 }}
                        className="flex items-center gap-1 text-[11px] font-mono"
                      >
                        <span className="text-brand-primary">{k}</span>
                        <span className="text-brand-text-subtle">:</span>
                        <span className="text-brand-text/70">{v}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-brand-text-subtle">{"{}"}</span>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-16 flex items-center justify-center"
          >
            <span className="text-[12px] text-brand-text-subtle font-mono">pick a pattern above</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
