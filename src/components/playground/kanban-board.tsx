"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, ChevronLeft, Check } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

interface Card {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/15 text-green-600",
  Medium: "bg-yellow-500/15 text-yellow-600",
  Hard: "bg-red-500/15 text-red-600",
};

type ColumnKey = "todo" | "progress" | "done";
const columnOrder: ColumnKey[] = ["todo", "progress", "done"];
const columnLabels: Record<ColumnKey, string> = {
  todo: "To Do",
  progress: "In Progress",
  done: "Done",
};

const initialCards: Record<ColumnKey, Card[]> = {
  todo: [
    { id: "1", title: "Two Sum", difficulty: "Easy", time: "10m" },
    { id: "2", title: "LRU Cache", difficulty: "Hard", time: "45m" },
    { id: "3", title: "Valid Parentheses", difficulty: "Easy", time: "15m" },
  ],
  progress: [
    { id: "4", title: "Merge Intervals", difficulty: "Medium", time: "25m" },
    { id: "5", title: "Binary Search", difficulty: "Easy", time: "12m" },
  ],
  done: [
    { id: "6", title: "Reverse Linked List", difficulty: "Easy", time: "8m" },
    { id: "7", title: "Max Subarray", difficulty: "Medium", time: "20m" },
  ],
};

export function KanbanBoard() {
  const [columns, setColumns] = useState(initialCards);

  const moveCard = (from: ColumnKey, cardId: string, direction: 1 | -1) => {
    const fromIdx = columnOrder.indexOf(from);
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx > 2) return;
    const to = columnOrder[toIdx];

    setColumns((prev) => {
      const card = prev[from].find((c) => c.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((c) => c.id !== cardId),
        [to]: [...prev[to], card],
      };
    });
  };

  return (
    <div className="grid grid-cols-3 gap-3 py-4">
      {columnOrder.map((col) => {
        const isDone = col === "done";
        const isProgress = col === "progress";
        return (
          <div
            key={col}
            className={`rounded-xl bg-muted/50 p-3 min-h-[200px] ${
              isProgress ? "border-l-2 border-primary" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-foreground tracking-tight">
                {columnLabels[col]}
              </span>
              <motion.span
                key={columns[col].length}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={spring}
                className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded-md"
              >
                {columns[col].length}
              </motion.span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {columns[col].map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={spring}
                    className={`rounded-lg bg-card p-2.5 shadow-sm transition-all duration-500 ${
                      isDone ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {isDone && (
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          )}
                          <span
                            className={`text-[11px] font-medium text-foreground ${
                              isDone ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {card.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${difficultyColor[card.difficulty]}`}
                          >
                            {card.difficulty}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                            <Clock className="w-2.5 h-2.5" />
                            {card.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Move buttons */}
                    <div className="flex justify-end gap-1 mt-2">
                      {columnOrder.indexOf(col) > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          transition={spring}
                          onClick={() => moveCard(col, card.id, -1)}
                          className="cursor-pointer w-5 h-5 rounded bg-muted flex items-center justify-center transition-all duration-500 hover:bg-primary/10"
                        >
                          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                        </motion.button>
                      )}
                      {columnOrder.indexOf(col) < 2 && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          transition={spring}
                          onClick={() => moveCard(col, card.id, 1)}
                          className="cursor-pointer w-5 h-5 rounded bg-muted flex items-center justify-center transition-all duration-500 hover:bg-primary/10"
                        >
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
