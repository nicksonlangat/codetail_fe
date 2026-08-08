"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

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
    <div
      className={`rounded-lg border p-3 ${
        ok ? "border-brand-success/20 bg-brand-success/5" : "border-brand-destructive/20 bg-brand-destructive/5"
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        {ok ? (
          <CheckCircle2 className="size-3.5 text-brand-success" />
        ) : (
          <XCircle className="size-3.5 text-brand-destructive" />
        )}
        <span className="text-[10px] font-mono text-brand-text-muted">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={result}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`text-[11px] font-mono leading-relaxed break-words ${
            ok ? "text-brand-text/80" : "text-brand-destructive/80"
          }`}
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
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block">
            Mutability Explorer
          </span>
          <span className="text-[11px] font-mono text-brand-text-subtle mt-0.5 block">
            items = [1, 2, 3, 4, 5]{"  ·  "}t = (1, 2, 3, 4, 5)
          </span>
        </div>
        <AnimatePresence>
          {op && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActive(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Try an operation
        </span>
        <div className="flex flex-wrap gap-1.5">
          {OPS.map((o) => (
            <motion.button
              key={o.label}
              onClick={() => setActive(active === o.label ? null : o.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                active === o.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
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
            <span className="text-[12px] text-brand-text-subtle font-mono">pick an operation above</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
