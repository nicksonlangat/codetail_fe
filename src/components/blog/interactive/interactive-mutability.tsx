"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Op = {
  label: string;
  listOk: boolean;
  listResult: string;
  tupleOk: boolean;
  tupleResult: string;
};

const OPS: Op[] = [
  {
    label: "items[0] = 99",
    listOk: true,
    listResult: "[99, 2, 3, 4, 5]",
    tupleOk: false,
    tupleResult: "TypeError: 'tuple' object does not support item assignment",
  },
  {
    label: "items.append(6)",
    listOk: true,
    listResult: "[1, 2, 3, 4, 5, 6]",
    tupleOk: false,
    tupleResult: "AttributeError: 'tuple' object has no attribute 'append'",
  },
  {
    label: "del items[0]",
    listOk: true,
    listResult: "[2, 3, 4, 5]",
    tupleOk: false,
    tupleResult: "TypeError: 'tuple' object doesn't support item deletion",
  },
  {
    label: "items[1:3]",
    listOk: true,
    listResult: "[2, 3]",
    tupleOk: true,
    tupleResult: "(2, 3)",
  },
  {
    label: "len(items)",
    listOk: true,
    listResult: "5",
    tupleOk: true,
    tupleResult: "5",
  },
  {
    label: "3 in items",
    listOk: true,
    listResult: "True",
    tupleOk: true,
    tupleResult: "True",
  },
  {
    label: "items + (6,)",
    listOk: false,
    listResult: "TypeError: can only concatenate list (not 'tuple') to list",
    tupleOk: true,
    tupleResult: "(1, 2, 3, 4, 5, 6)",
  },
];

function ResultCard({ label, ok, result }: { label: string; ok: boolean; result: string }) {
  return (
    <div className={cn(
      "rounded-lg border p-3",
      ok ? "border-green-500/20 bg-green-500/5" : "border-red-400/20 bg-red-400/5"
    )}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={cn("text-[11px]", ok ? "text-green-500" : "text-red-400")}>
          {ok ? "✓" : "✗"}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={result}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "text-[11px] font-mono leading-relaxed break-words",
            ok ? "text-foreground/80" : "text-red-400/80"
          )}
        >
          {result}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function InteractiveMutability() {
  const [active, setActive] = useState<string | null>(null);
  const op = OPS.find((o) => o.label === active) ?? null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block">
            Mutability Explorer
          </span>
          <span className="text-[11px] font-mono text-muted-foreground/40 mt-0.5 block">
            items = [1, 2, 3, 4, 5]{"  ·  "}t = (1, 2, 3, 4, 5)
          </span>
        </div>
        <AnimatePresence>
          {op && (
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
          Try an operation
        </span>
        <div className="flex flex-wrap gap-1.5">
          {OPS.map((o) => (
            <motion.button
              key={o.label}
              onClick={() => setActive(active === o.label ? null : o.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                active === o.label
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground bg-secondary border-border hover:text-foreground"
              )}
            >
              {o.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {op ? (
          <motion.div
            key={op.label}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="list" ok={op.listOk} result={op.listResult} />
              <ResultCard label="tuple" ok={op.tupleOk} result={op.tupleResult} />
            </div>
          </motion.div>
        ) : (
          <div className="h-10 flex items-center justify-center">
            <span className="text-[12px] text-muted-foreground/30 font-mono">pick an operation above</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
