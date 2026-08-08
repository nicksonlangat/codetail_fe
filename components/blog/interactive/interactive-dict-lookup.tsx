"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

const DICT: Record<string, string> = {
  python: "Guido van Rossum",
  javascript: "Brendan Eich",
  ruby: "Yukihiro Matsumoto",
  rust: "Graydon Hoare",
  go: "Robert Griesemer",
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
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block">
            Dict Lookup Explorer
          </span>
          <span className="text-[11px] font-mono text-brand-text-subtle mt-0.5 block">
            creators = {"{ python: ..., javascript: ..., ruby: ..., rust: ..., go: ... }"}
          </span>
        </div>
        <AnimatePresence>
          {activeKey && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActiveKey(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 mb-5">
        {(["bracket", "get"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
              mode === m
                ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
            }`}
          >
            {m === "bracket" ? 'd["key"]' : 'd.get("key")'}
          </motion.button>
        ))}
      </div>

      <div className="space-y-2 mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
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
                transition={SPRING}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                  activeKey === k
                    ? inDict
                      ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                      : "border-brand-destructive/20 bg-brand-destructive/8 text-brand-destructive"
                    : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
                }`}
              >
                {k}
                {!inDict && <span className="ml-1 text-[9px] opacity-50">?</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {resultCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-lg border p-3 ${
                exists
                  ? "border-brand-success/20 bg-brand-success/5"
                  : mode === "get"
                    ? "border-brand-warning/20 bg-brand-warning/5"
                    : "border-brand-destructive/20 bg-brand-destructive/5"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.code
                  key={resultCode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`text-[12px] font-mono ${
                    exists
                      ? "text-brand-success"
                      : mode === "get"
                        ? "text-brand-warning"
                        : "text-brand-destructive"
                  }`}
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
          <span className="text-[12px] text-brand-text-subtle font-mono">pick a key above</span>
        </div>
      )}
    </div>
  );
}
