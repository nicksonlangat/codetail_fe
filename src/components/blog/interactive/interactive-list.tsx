"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUp, ArrowDown, Shuffle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type InteractiveListProps = {
  initialItems?: (string | number)[];
  showCode?: boolean;
};

export function InteractiveList({ initialItems = ["apple", "banana", "cherry"], showCode = true }: InteractiveListProps) {
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

  const reset = () => setItems(initialItems);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Interactive List
        </span>
        <button
          onClick={reset}
          className="p-1.5 rounded hover:bg-secondary transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* List visualization */}
      <div className="flex flex-wrap gap-2 mb-6">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={`${i}-${item}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "relative px-4 py-2 rounded-lg border text-[13px] font-mono",
                highlightedIndex === i
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/30"
              )}
            >
              <span className="text-foreground">{item}</span>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground bg-card px-1">
                {i}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Operations */}
      <div className="flex flex-wrap gap-2 mb-4">
        {operations.map((op) => (
          <button
            key={op.name}
            onClick={op.action}
            className="px-3 py-1.5 text-[11px] font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md border border-border transition-colors"
          >
            {op.name}
          </button>
        ))}
      </div>

      {/* Generated code */}
      {showCode && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground mb-1">Current state</div>
          <code className="text-[12px] font-mono text-foreground">
            [{items.map((i) => typeof i === "string" ? `'${i}'` : i).join(", ")}]
          </code>
        </div>
      )}
    </div>
  );
}