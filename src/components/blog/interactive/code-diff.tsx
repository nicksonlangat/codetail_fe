"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export type DiffLine = {
  type: "added" | "removed" | "context";
  content: string;
};

type CodeDiffProps = {
  filename: string;
  before: string;
  after: string;
  diff: DiffLine[];
};

type Tab = "before" | "after" | "diff";

export function CodeDiff({ filename, before, after, diff }: CodeDiffProps) {
  const [tab, setTab] = useState<Tab>("diff");

  const added = diff.filter((l) => l.type === "added").length;
  const removed = diff.filter((l) => l.type === "removed").length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <span className="font-mono text-[10px] text-muted-foreground">{filename}</span>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-emerald-600 dark:text-emerald-400">+{added}</span>
          <span className="text-red-500 dark:text-red-400">-{removed}</span>
        </div>
      </div>

      <div className="flex border-b border-border">
        {(["before", "after", "diff"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-2 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="capitalize">{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {tab !== "diff" ? (
            <pre className="text-[10px] font-mono px-4 py-3 overflow-x-auto leading-relaxed bg-muted/50">
              {tab === "before" ? before : after}
            </pre>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <tbody>
                  {diff.map((line, i) => (
                    <tr
                      key={i}
                      className={
                        line.type === "added"
                          ? "bg-emerald-500/8 dark:bg-emerald-500/10"
                          : line.type === "removed"
                          ? "bg-red-500/8 dark:bg-red-500/10"
                          : ""
                      }
                    >
                      <td
                        className={`pl-3 pr-2 py-0.5 w-5 select-none font-bold text-center ${
                          line.type === "added"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : line.type === "removed"
                            ? "text-red-500 dark:text-red-400"
                            : "text-muted-foreground/20"
                        }`}
                      >
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                      </td>
                      <td className="pr-4 py-0.5 leading-relaxed whitespace-pre">
                        {line.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
