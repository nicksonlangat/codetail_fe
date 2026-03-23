"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

type Row = {
  id: number;
  problem: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  status: "Solved" | "Attempted" | "Not started";
};

const initialData: Row[] = [
  { id: 1, problem: "Two Sum", difficulty: "Easy", time: "4m 12s", status: "Solved" },
  { id: 2, problem: "Merge Intervals", difficulty: "Medium", time: "12m 30s", status: "Solved" },
  { id: 3, problem: "LRU Cache", difficulty: "Hard", time: "28m 05s", status: "Attempted" },
  { id: 4, problem: "Valid Parentheses", difficulty: "Easy", time: "3m 45s", status: "Solved" },
  { id: 5, problem: "Binary Tree Zigzag", difficulty: "Medium", time: "—", status: "Not started" },
  { id: 6, problem: "Median of Two Sorted", difficulty: "Hard", time: "—", status: "Not started" },
];

type SortKey = keyof Row;
type SortDir = "asc" | "desc";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-500",
  Medium: "text-orange-500",
  Hard: "text-red-500",
};

const statusDot: Record<string, string> = {
  Solved: "bg-green-500",
  Attempted: "bg-orange-500",
  "Not started": "bg-muted-foreground/30",
};

const columns: { key: SortKey; label: string; width: string }[] = [
  { key: "id", label: "#", width: "w-10" },
  { key: "problem", label: "Problem", width: "flex-1" },
  { key: "difficulty", label: "Difficulty", width: "w-20" },
  { key: "time", label: "Time", width: "w-20" },
  { key: "status", label: "Status", width: "w-24" },
];

export function DataTableMini() {
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const sorted = [...initialData].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    const as = String(av);
    const bs = String(bv);
    return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="py-6">
      <div className="border border-border/40 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-3 py-2 bg-muted/50 sticky top-0">
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleSort(col.key)}
              className={`cursor-pointer flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 hover:text-muted-foreground transition-all duration-500 ${col.width}`}
            >
              {col.label}
              {sortKey === col.key && (
                <motion.div
                  animate={{ rotate: sortDir === "desc" ? 180 : 0 }}
                  transition={spring}
                >
                  <ChevronUp className="w-3 h-3" />
                </motion.div>
              )}
            </button>
          ))}
          {/* Space for arrow */}
          <div className="w-6" />
        </div>

        {/* Rows */}
        <div>
          {sorted.map((row) => (
            <motion.div
              key={row.id}
              layout
              transition={spring}
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
              className="flex items-center px-3 py-2 border-b border-border/40 last:border-b-0 cursor-pointer transition-all duration-500 hover:bg-muted/50"
            >
              <span className="text-[12px] font-mono text-muted-foreground/50 w-10 tabular-nums">
                {row.id}
              </span>
              <span className="text-[12px] text-foreground font-medium flex-1">
                {row.problem}
              </span>
              <span className={`text-[12px] font-medium w-20 ${difficultyColor[row.difficulty]}`}>
                {row.difficulty}
              </span>
              <span className="text-[12px] font-mono text-muted-foreground w-20 tabular-nums">
                {row.time}
              </span>
              <span className="text-[12px] text-muted-foreground w-24 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[row.status]}`} />
                {row.status}
              </span>
              <motion.span
                animate={{
                  opacity: hoveredRow === row.id ? 1 : 0,
                  x: hoveredRow === row.id ? 0 : -4,
                }}
                transition={spring}
                className="w-6 text-right text-muted-foreground text-[12px]"
              >
                &rarr;
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
