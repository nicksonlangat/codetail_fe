"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type ColorPreset = { name: string; r: number; g: number; b: number };

const PRESETS: ColorPreset[] = [
  { name: "Coral",  r: 255, g: 99,  b: 88  },
  { name: "Teal",   r: 31,  g: 173, b: 135 },
  { name: "Indigo", r: 99,  g: 102, b: 241 },
  { name: "Amber",  r: 251, g: 191, b: 36  },
  { name: "Slate",  r: 100, g: 116, b: 139 },
];

const FIELDS = [
  { name: "red",   index: 0 },
  { name: "green", index: 1 },
  { name: "blue",  index: 2 },
] as const;

type FieldName = "red" | "green" | "blue";

export function InteractiveNamedTuple() {
  const [activeColor, setActiveColor] = useState<string>(PRESETS[0].name);
  const [activeField, setActiveField] = useState<FieldName | null>(null);

  const color = PRESETS.find((c) => c.name === activeColor)!;
  const values: Record<FieldName, number> = { red: color.r, green: color.g, blue: color.b };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          NamedTuple Explorer
        </span>
        <code className="text-[10px] font-mono text-muted-foreground/40 hidden sm:block">
          Color = namedtuple('Color', ['red', 'green', 'blue'])
        </code>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick a color
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((c) => (
            <motion.button
              key={c.name}
              onClick={() => { setActiveColor(c.name); setActiveField(null); }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md border text-[11px] font-mono transition-all duration-500 cursor-pointer",
                activeColor === c.name
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})` }}
              />
              {c.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <motion.div
          className="w-14 h-14 rounded-xl flex-shrink-0 border border-border/30"
          animate={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
          transition={{ duration: 0.35 }}
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono text-muted-foreground/40 mb-1.5 block">instance</span>
          <div className="font-mono text-[12px] text-foreground/80 bg-muted px-3 py-2 rounded-lg">
            c = Color(
            <span className="text-red-500 dark:text-red-400">{color.r}</span>,{" "}
            <span className="text-green-600 dark:text-green-400">{color.g}</span>,{" "}
            <span className="text-blue-500 dark:text-blue-400">{color.b}</span>
            )
          </div>
          <div className="font-mono text-[11px] text-muted-foreground/50 mt-1.5 px-1">
            isinstance(c, tuple){" "}
            <span className="text-primary">True</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Click a field
        </span>
        <div className="flex gap-2">
          {FIELDS.map((f) => (
            <motion.button
              key={f.name}
              onClick={() => setActiveField(activeField === f.name ? null : f.name)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                activeField === f.name
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
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
            <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 block mb-1.5">
                  by name
                </span>
                <AnimatePresence mode="wait">
                  <motion.code
                    key={activeField + color.name}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-[12px] font-mono text-primary"
                  >
                    c.{activeField} = {values[activeField]}
                  </motion.code>
                </AnimatePresence>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 block mb-1.5">
                  by index
                </span>
                <AnimatePresence mode="wait">
                  <motion.code
                    key={activeField + color.name + "idx"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-[12px] font-mono text-foreground/70"
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
