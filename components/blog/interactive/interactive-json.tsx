"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type Preset = { label: string; obj: object };

const PRESETS: Preset[] = [
  {
    label: "User",
    obj: { name: "Alice", age: 30, admin: true, tags: ["python", "backend"] },
  },
  {
    label: "Config",
    obj: { host: "localhost", port: 5432, debug: false, timeout: null },
  },
  {
    label: "API response",
    obj: { status: "ok", data: [{ id: 1, score: 92 }, { id: 2, score: 78 }], total: 2 },
  },
  {
    label: "Error",
    obj: { error: "NotFound", message: "user not found", code: 404 },
  },
];

type Indent = 0 | 2 | 4;

export function InteractiveJSON() {
  const [activeLabel, setActiveLabel] = useState(PRESETS[0].label);
  const [indent, setIndent] = useState<Indent>(2);

  const preset = PRESETS.find((p) => p.label === activeLabel)!;
  const jsonStr = JSON.stringify(preset.obj, null, indent || undefined);
  const pyRepr = JSON.stringify(preset.obj, null, 2)
    .replace(/: true/g, ": True")
    .replace(/: false/g, ": False")
    .replace(/: null/g, ": None");

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block mb-4">
        JSON Explorer
      </span>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick an object
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActiveLabel(p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activeLabel === p.label
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
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle self-center mr-1">
          indent
        </span>
        {([0, 2, 4] as Indent[]).map((n) => (
          <motion.button
            key={n}
            onClick={() => setIndent(n)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
              indent === n
                ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
            }`}
          >
            {n === 0 ? "none" : n}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLabel + indent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid sm:grid-cols-2 gap-3"
        >
          <div>
            <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-1.5">
              Python object
            </span>
            <pre className="font-mono text-[11px] text-brand-text/70 bg-brand-surface/50 rounded-lg p-3 overflow-x-auto">
              {pyRepr}
            </pre>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-1.5">
              json.dumps(obj, indent={indent || "None"})
            </span>
            <pre className="font-mono text-[11px] text-brand-primary/80 bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-3 overflow-x-auto">
              {jsonStr}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 text-[10px] font-mono text-brand-text-subtle">
        json.loads(json_string) → back to Python dict
      </div>
    </div>
  );
}
