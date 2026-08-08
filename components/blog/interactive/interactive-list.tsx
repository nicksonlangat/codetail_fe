"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

type InteractiveListProps = {
  initialItems?: (string | number)[];
  showCode?: boolean;
};

export function InteractiveList({
  initialItems = ["apple", "banana", "cherry"],
  showCode = true,
}: InteractiveListProps) {
  const [items, setItems] = useState<(string | number)[]>(initialItems);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const operations: { name: string; action: () => void; code: string }[] = [
    {
      name: "Append",
      action: () => {
        setHighlightedIndex(items.length);
        setTimeout(() => setItems([...items, "new"]), 300);
        setTimeout(() => setHighlightedIndex(null), 600);
      },
      code: "my_list.append('new')",
    },
    {
      name: "Insert",
      action: () => {
        if (items.length > 0) {
          const idx = Math.floor(items.length / 2);
          setHighlightedIndex(idx);
          const newItems = [...items];
          newItems.splice(idx, 0, "new");
          setItems(newItems);
          setTimeout(() => setHighlightedIndex(null), 600);
        }
      },
      code: "my_list.insert(1, 'new')",
    },
    {
      name: "Pop",
      action: () => {
        if (items.length > 0) {
          setHighlightedIndex(items.length - 1);
          setTimeout(() => setItems(items.slice(0, -1)), 300);
          setTimeout(() => setHighlightedIndex(null), 600);
        }
      },
      code: "my_list.pop()",
    },
    {
      name: "Remove",
      action: () => {
        if (items.length > 0) {
          const idx = Math.floor(items.length / 2);
          setHighlightedIndex(idx);
          setTimeout(() => setItems(items.filter((_, i) => i !== idx)), 300);
          setTimeout(() => setHighlightedIndex(null), 600);
        }
      },
      code: "my_list.remove('banana')",
    },
    {
      name: "Sort",
      action: () => setItems([...items].sort()),
      code: "my_list.sort()",
    },
    {
      name: "Reverse",
      action: () => setItems([...items].reverse()),
      code: "my_list.reverse()",
    },
  ];

  function reset() {
    setItems(initialItems);
  }

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Interactive List
        </span>
        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.1, rotate: -15 }}
          whileTap={{ scale: 0.9 }}
          transition={SPRING}
          className="p-1.5 rounded hover:bg-brand-surface transition-all duration-500 cursor-pointer outline-none"
          title="Reset"
        >
          <RotateCcw className="size-3.5 text-brand-text-muted" />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={`${i}-${item}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: highlightedIndex === i ? 1.1 : 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative px-4 py-2 rounded-lg border text-[13px] font-mono ${
                highlightedIndex === i
                  ? "border-brand-primary bg-brand-primary/10"
                  : "border-brand-border bg-brand-surface/50"
              }`}
            >
              <span className="text-brand-text">{item}</span>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] text-brand-text-subtle bg-white px-1">
                {i}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block mb-2">
          Try it, click an operation
        </span>
        <div className="flex flex-wrap gap-2">
          {operations.map((op) => (
            <motion.button
              key={op.name}
              onClick={op.action}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className="px-3 py-1.5 text-[11px] font-medium text-brand-text bg-brand-surface hover:bg-brand-surface/70 rounded-md border border-brand-border transition-all duration-500 cursor-pointer outline-none"
            >
              {op.name}
            </motion.button>
          ))}
        </div>
      </div>

      {showCode && (
        <div className="bg-brand-surface/60 rounded-lg p-3">
          <div className="text-[10px] text-brand-text-muted mb-1">Current state</div>
          <AnimatePresence mode="wait">
            <motion.code
              key={items.join(",")}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[12px] font-mono text-brand-text block"
            >
              [{items.map((i) => (typeof i === "string" ? `'${i}'` : i)).join(", ")}]
            </motion.code>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
