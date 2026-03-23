"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock } from "lucide-react";

type StepStatus = "completed" | "current" | "locked";

interface Step {
  id: string;
  title: string;
  subtitle: string;
  status: StepStatus;
  details: string;
}

const steps: Step[] = [
  { id: "1", title: "Two Pointers", subtitle: "Pattern fundamentals", status: "completed", details: "Master the two-pointer technique for sorted arrays, linked lists, and string problems. Covers converging, diverging, and fast-slow pointer patterns." },
  { id: "2", title: "Sliding Window", subtitle: "Subarray optimization", status: "completed", details: "Learn fixed and variable-size sliding window approaches for contiguous subarray/substring problems. Includes maximum sum, smallest subarray, and longest substring patterns." },
  { id: "3", title: "Binary Search", subtitle: "Divide & conquer", status: "completed", details: "Go beyond basic search to apply binary search on answer spaces, rotated arrays, and matrix problems. Covers lower/upper bounds and search space reduction." },
  { id: "4", title: "BFS & DFS", subtitle: "Graph traversal", status: "current", details: "Explore breadth-first and depth-first traversal on trees, graphs, and matrices. Includes level-order, shortest path, cycle detection, and topological sort." },
  { id: "5", title: "Dynamic Programming", subtitle: "Optimal substructure", status: "locked", details: "Build intuition for identifying DP problems. Covers memoization, tabulation, state transitions, and classic patterns like knapsack and LCS." },
  { id: "6", title: "Advanced Graphs", subtitle: "Shortest paths & MST", status: "locked", details: "Tackle Dijkstra, Bellman-Ford, Floyd-Warshall, and minimum spanning trees. Includes union-find, Kruskal's, and Prim's algorithms." },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export function ProgressPath() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isExpanded = expandedId === step.id;
        const isLast = i === steps.length - 1;
        const nextCompleted = i < steps.length - 1 && steps[i + 1].status === "completed";

        return (
          <div key={step.id} className="relative">
            {/* Connecting line */}
            {!isLast && (
              <div className="absolute left-[7px] top-[20px] w-[2px] h-[calc(100%-4px)]">
                <div className="w-full h-full bg-border" />
                <motion.div
                  className="absolute inset-0 bg-primary origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: step.status === "completed" && nextCompleted ? 1 : step.status === "completed" ? 1 : 0 }}
                  transition={{ ...spring, delay: i * 0.1 }}
                />
              </div>
            )}

            {/* Node row */}
            <motion.button
              className="relative flex items-start gap-3 w-full text-left py-2 group cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : step.id)}
              whileHover={{ x: 2 }}
              transition={spring}
            >
              {/* Circle node */}
              <div className="relative flex-shrink-0 mt-0.5">
                {step.status === "completed" && (
                  <motion.div
                    className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: i * 0.08 }}
                  >
                    <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                  </motion.div>
                )}
                {step.status === "current" && (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-primary bg-background flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: i * 0.08 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                )}
                {step.status === "locked" && (
                  <motion.div
                    className="w-4 h-4 rounded-full bg-muted flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: i * 0.08 }}
                  >
                    <Lock className="w-2 h-2 text-muted-foreground" />
                  </motion.div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium leading-tight ${step.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{step.subtitle}</p>
              </div>

              {/* Status indicator */}
              {step.status === "current" && (
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md mt-0.5">
                  In Progress
                </span>
              )}
            </motion.button>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={spring}
                  className="overflow-hidden ml-7"
                >
                  <div className="pb-3 pt-1">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {step.details}
                    </p>
                    {step.status !== "locked" && (
                      <motion.button
                        className="mt-2 text-[11px] font-medium text-primary hover:text-primary/80 transition-all duration-500"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.1 }}
                      >
                        {step.status === "current" ? "Continue learning →" : "Review →"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
