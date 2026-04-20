"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const DICT: Record<string, string> = {
  python:     "Guido van Rossum",
  javascript: "Brendan Eich",
  ruby:       "Yukihiro Matsumoto",
  rust:       "Graydon Hoare",
  go:         "Robert Griesemer",
};

const ALL_KEYS = [...Object.keys(DICT), "java", "swift", "cobol"];

type Mode = "bracket" | "get";

export function InteractiveDictLookup() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("bracket");

  const value = activeKey ? DICT[activeKey] : undefined;
  const exists = activeKey ? activeKey in DICT : false;

  const resultCode =
    activeKey === null
      ? null
      : mode === "bracket"
      ? exists
        ? `creators["${activeKey}"]  →  "${value}"`
        : `creators["${activeKey}"]  →  KeyError: '${activeKey}'`
      : exists
      ? `creators.get("${activeKey}")  →  "${value}"`
      : `creators.get("${activeKey}", "unknown")  →  "unknown"`;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block">
            Dict Lookup Explorer
          </span>
          <span className="text-[11px] font-mono text-muted-foreground/40 mt-0.5 block">
            creators = {"{ python: ..., javascript: ..., ruby: ..., rust: ..., go: ... }"}
          </span>
        </div>
        <AnimatePresence>
          {activeKey && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring}
              onClick={() => setActiveKey(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-5">
        {(["bracket", "get"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className={cn(
              "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
              mode === m
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-muted-foreground bg-secondary border-border hover:text-foreground"
            )}
          >
            {m === "bracket" ? 'd["key"]' : 'd.get("key")'}
          </motion.button>
        ))}
      </div>

      {/* Key chips */}
      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Try a key
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_KEYS.map((k) => {
            const inDict = k in DICT;
            return (
              <motion.button
                key={k}
                onClick={() => setActiveKey(activeKey === k ? null : k)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                className={cn(
                  "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
                  activeKey === k
                    ? inDict
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-red-400/20 bg-red-400/8 text-red-400"
                    : "text-muted-foreground bg-secondary border-border hover:text-foreground"
                )}
              >
                {k}
                {!inDict && (
                  <span className="ml-1 text-[9px] opacity-50">?</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {resultCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "rounded-lg border p-3",
              exists
                ? "border-green-500/20 bg-green-500/5"
                : mode === "get"
                ? "border-amber-400/20 bg-amber-400/5"
                : "border-red-400/20 bg-red-400/5"
            )}>
              <AnimatePresence mode="wait">
                <motion.code
                  key={resultCode}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "text-[12px] font-mono",
                    exists
                      ? "text-green-600 dark:text-green-400"
                      : mode === "get"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-500"
                  )}
                >
                  {resultCode}
                </motion.code>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeKey && (
        <div className="h-10 flex items-center justify-center">
          <span className="text-[12px] text-muted-foreground/30 font-mono">pick a key above</span>
        </div>
      )}
    </div>
  );
}
