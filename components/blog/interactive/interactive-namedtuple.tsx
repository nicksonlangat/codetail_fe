"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type ColorPreset = { name: string; r: number; g: number; b: number };

const PRESETS: ColorPreset[] = [
  { name: "Coral", r: 255, g: 99, b: 88 },
  { name: "Teal", r: 31, g: 173, b: 135 },
  { name: "Indigo", r: 99, g: 102, b: 241 },
  { name: "Amber", r: 251, g: 191, b: 36 },
  { name: "Slate", r: 100, g: 116, b: 139 },
];

const FIELDS = [
  { name: "red", index: 0 },
  { name: "green", index: 1 },
  { name: "blue", index: 2 },
] as const;

type FieldName = "red" | "green" | "blue";

export function InteractiveNamedTuple() {
  const [activeColor, setActiveColor] = useState<string>(PRESETS[0].name);
  const [activeField, setActiveField] = useState<FieldName | null>(null);

  const color = PRESETS.find((c) => c.name === activeColor)!;
  const values: Record<FieldName, number> = { red: color.r, green: color.g, blue: color.b };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          NamedTuple Explorer
        </span>
        <code className="text-[10px] font-mono text-brand-text-subtle hidden sm:block">
          Color = namedtuple(&apos;Color&apos;, [&apos;red&apos;, &apos;green&apos;, &apos;blue&apos;])
        </code>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Pick a color
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((c) => (
            <motion.button
              key={c.name}
              onClick={() => {
                setActiveColor(c.name);
                setActiveField(null);
              }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[11px] font-mono transition-all duration-500 cursor-pointer outline-none ${
                activeColor === c.name
                  ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                  : "border-brand-border bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})` }}
              />
              {c.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <motion.div
          className="size-14 rounded-xl shrink-0 border border-brand-border/60"
          animate={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
          transition={{ duration: 0.35 }}
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono text-brand-text-subtle mb-1.5 block">instance</span>
          <div className="font-mono text-[12px] text-brand-text/80 bg-brand-surface px-3 py-2 rounded-lg">
            c = Color(
            <span className="text-red-500">{color.r}</span>,{" "}
            <span className="text-green-600">{color.g}</span>,{" "}
            <span className="text-blue-500">{color.b}</span>)
          </div>
          <div className="font-mono text-[11px] text-brand-text-subtle mt-1.5 px-1">
            isinstance(c, tuple) <span className="text-brand-primary">True</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Click a field
        </span>
        <div className="flex gap-2">
          {FIELDS.map((f) => (
            <motion.button
              key={f.name}
              onClick={() => setActiveField(activeField === f.name ? null : f.name)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                activeField === f.name
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              .{f.name}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-surface/60 rounded-lg p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-1.5">
                  by name
                </span>
                <AnimatePresence mode="wait">
                  <motion.code
                    key={activeField + color.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-[12px] font-mono text-brand-primary"
                  >
                    c.{activeField} = {values[activeField]}
                  </motion.code>
                </AnimatePresence>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle block mb-1.5">
                  by index
                </span>
                <AnimatePresence mode="wait">
                  <motion.code
                    key={activeField + color.name + "idx"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-[12px] font-mono text-brand-text/70"
                  >
                    c[{FIELDS.find((f) => f.name === activeField)!.index}] = {values[activeField]}
                  </motion.code>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
