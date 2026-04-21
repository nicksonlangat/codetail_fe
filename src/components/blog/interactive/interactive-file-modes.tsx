"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Mode = {
  mode: string;
  desc: string;
  read: boolean;
  write: boolean;
  creates: boolean;
  truncates: boolean;
  appends: boolean;
  binary: boolean;
  errIfExists: boolean;
  errIfMissing: boolean;
};

const MODES: Mode[] = [
  { mode: "r",  desc: "Read only. Default mode.",                              read: true,  write: false, creates: false, truncates: false, appends: false, binary: false, errIfExists: false, errIfMissing: true  },
  { mode: "w",  desc: "Write only. Creates the file, or truncates it.",         read: false, write: true,  creates: true,  truncates: true,  appends: false, binary: false, errIfExists: false, errIfMissing: false },
  { mode: "a",  desc: "Append. Writes go to the end. Creates if absent.",       read: false, write: true,  creates: true,  truncates: false, appends: true,  binary: false, errIfExists: false, errIfMissing: false },
  { mode: "x",  desc: "Exclusive create. Errors if the file already exists.",   read: false, write: true,  creates: true,  truncates: false, appends: false, binary: false, errIfExists: true,  errIfMissing: false },
  { mode: "r+", desc: "Read and write. File must already exist.",                read: true,  write: true,  creates: false, truncates: false, appends: false, binary: false, errIfExists: false, errIfMissing: true  },
  { mode: "w+", desc: "Read and write. Creates or truncates.",                   read: true,  write: true,  creates: true,  truncates: true,  appends: false, binary: false, errIfExists: false, errIfMissing: false },
  { mode: "rb", desc: "Binary read. Returns bytes, not strings.",                read: true,  write: false, creates: false, truncates: false, appends: false, binary: true,  errIfExists: false, errIfMissing: true  },
  { mode: "wb", desc: "Binary write. Writes bytes. Creates or truncates.",       read: false, write: true,  creates: true,  truncates: true,  appends: false, binary: true,  errIfExists: false, errIfMissing: false },
];

const COLS: { key: keyof Mode; label: string }[] = [
  { key: "read",         label: "read"    },
  { key: "write",        label: "write"   },
  { key: "creates",      label: "creates" },
  { key: "truncates",    label: "truncates" },
  { key: "appends",      label: "appends" },
  { key: "binary",       label: "binary"  },
  { key: "errIfExists",  label: "err if exists" },
  { key: "errIfMissing", label: "err if missing" },
];

export function InteractiveFileModes() {
  const [active, setActive] = useState<string | null>(null);
  const mode = MODES.find((m) => m.mode === active) ?? null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          File Mode Explorer
        </span>
        <AnimatePresence>
          {active && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring}
              onClick={() => setActive(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Pick a mode
        </span>
        <div className="flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <motion.button
              key={m.mode}
              onClick={() => setActive(active === m.mode ? null : m.mode)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[12px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                active === m.mode
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {m.mode}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mode && (
          <motion.div
            key={mode.mode}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="font-mono text-[12px] text-primary bg-primary/8 border border-primary/15 rounded-lg px-3 py-2 mb-4">
              open(&quot;file.txt&quot;, &quot;{mode.mode}&quot;)
            </div>
            <p className="text-[12px] text-muted-foreground/80 mb-4">{mode.desc}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLS.map(({ key, label }) => {
                const val = mode[key] as boolean;
                return (
                  <div key={key} className={cn(
                    "rounded-lg border p-2.5 text-center",
                    val
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-border/30 bg-muted/20"
                  )}>
                    <span className={cn("text-[10px] block mb-1", val ? "text-green-500" : "text-muted-foreground/30")}>
                      {val ? "✓" : "–"}
                    </span>
                    <span className={cn("text-[9px] uppercase tracking-wider font-medium", val ? "text-foreground/70" : "text-muted-foreground/30")}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <div className="h-10 flex items-center justify-center">
          <span className="text-[12px] text-muted-foreground/30 font-mono">pick a mode above</span>
        </div>
      )}
    </div>
  );
}
