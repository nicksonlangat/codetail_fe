"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

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
    <div className="bg-card border border-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block mb-4">
        JSON Explorer
      </span>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick an object
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              onClick={() => setActiveLabel(p.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                activeLabel === p.label
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 self-center mr-1">
          indent
        </span>
        {([0, 2, 4] as Indent[]).map((n) => (
          <motion.button
            key={n}
            onClick={() => setIndent(n)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className={cn(
              "px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
              indent === n
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-muted-foreground bg-secondary border-border hover:text-foreground"
            )}
          >
            {n === 0 ? "none" : n}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLabel + indent}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid sm:grid-cols-2 gap-3"
        >
          <div>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 block mb-1.5">
              Python object
            </span>
            <pre className="font-mono text-[11px] text-foreground/70 bg-muted/50 rounded-lg p-3 overflow-x-auto">
              {pyRepr}
            </pre>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 block mb-1.5">
              json.dumps(obj, indent={indent || "None"})
            </span>
            <pre className="font-mono text-[11px] text-primary/80 bg-primary/5 border border-primary/10 rounded-lg p-3 overflow-x-auto">
              {jsonStr}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 text-[10px] font-mono text-muted-foreground/40">
        json.loads(json_string) → back to Python dict
      </div>
    </div>
  );
}
