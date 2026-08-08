"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type ScopeLevel = "builtin" | "global" | "enclosing" | "local";

type ScopeVar = { name: string; value: string; scope: ScopeLevel };

const VARS: ScopeVar[] = [
  { name: "print", value: "<built-in function>", scope: "builtin" },
  { name: "len", value: "<built-in function>", scope: "builtin" },
  { name: "MAX", value: "100", scope: "global" },
  { name: "config", value: '{"debug": False}', scope: "global" },
  { name: "multiplier", value: "3", scope: "enclosing" },
  { name: "prefix", value: '"hello"', scope: "enclosing" },
  { name: "x", value: "5", scope: "local" },
  { name: "result", value: "15", scope: "local" },
];

const SCOPES: { id: ScopeLevel; label: string; color: string; bg: string; border: string }[] = [
  { id: "builtin", label: "Built-in", color: "text-brand-text-subtle", bg: "bg-brand-surface/60", border: "border-brand-border" },
  { id: "global", label: "Global", color: "text-brand-text-muted", bg: "bg-brand-surface", border: "border-brand-border" },
  { id: "enclosing", label: "Enclosing", color: "text-brand-warning", bg: "bg-brand-warning/5", border: "border-brand-warning/20" },
  { id: "local", label: "Local", color: "text-brand-primary", bg: "bg-brand-primary/5", border: "border-brand-primary/20" },
];

function findScope(name: string): ScopeLevel | null {
  for (const s of ["local", "enclosing", "global", "builtin"] as ScopeLevel[]) {
    if (VARS.find((v) => v.name === name && v.scope === s)) return s;
  }
  return null;
}

export function InteractiveScope() {
  const [active, setActive] = useState<string | null>(null);
  const resolvedScope = active ? findScope(active) : null;
  const resolvedVar = active ? VARS.find((v) => v.name === active && v.scope === resolvedScope) : null;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          LEGB Scope Explorer
        </span>
        <AnimatePresence>
          {active && (
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

      <div className="relative mb-5 space-y-0">
        {SCOPES.map((scope) => {
          const vars = VARS.filter((v) => v.scope === scope.id);
          const isResolved = resolvedScope === scope.id;
          const isDimmed = active !== null && !isResolved;

          return (
            <motion.div
              key={scope.id}
              animate={{ opacity: isDimmed ? 0.35 : 1 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl border p-3 mb-2 transition-all duration-300 ${scope.bg} ${scope.border} ${
                isResolved ? "ring-1 ring-brand-primary/30" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-medium ${scope.color}`}>
                  {scope.label}
                </span>
                {isResolved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] font-mono text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded"
                  >
                    found here
                  </motion.span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vars.map((v) => (
                  <motion.button
                    key={v.name}
                    onClick={() => setActive(active === v.name ? null : v.name)}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={SPRING}
                    className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all duration-500 cursor-pointer outline-none ${
                      active === v.name
                        ? "border-brand-primary/30 bg-brand-primary/15 text-brand-primary"
                        : "border-brand-border/50 bg-white text-brand-text/70 hover:text-brand-text"
                    }`}
                  >
                    {v.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {resolvedVar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-surface/50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-[11px] font-mono text-brand-primary">{resolvedVar.name}</span>
              <span className="text-brand-text-subtle text-[11px]">=</span>
              <span className="text-[11px] font-mono text-brand-text/70">{resolvedVar.value}</span>
              <span className="ml-auto text-[10px] font-mono text-brand-text-subtle">
                from {resolvedScope} scope
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <div className="h-8 flex items-center justify-center">
          <span className="text-[11px] text-brand-text-subtle font-mono">click a variable to resolve it</span>
        </div>
      )}
    </div>
  );
}
