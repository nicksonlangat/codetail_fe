"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, Users, ArrowRight } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  concept: string;
  time: string;
  description: string;
  requirements: string[];
  successRate: number;
  avgTime: string;
}

const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    concept: "Hash Map",
    time: "15 min",
    description: "Given an array of integers and a target sum, return the indices of two numbers that add up to the target. Each input has exactly one solution.",
    requirements: ["O(n) time complexity", "Handle negative numbers", "Return indices in ascending order"],
    successRate: 87,
    avgTime: "8 min",
  },
  {
    id: "valid-parens",
    title: "Valid Parentheses",
    difficulty: "Medium",
    concept: "Stack",
    time: "20 min",
    description: "Determine if an input string of brackets is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    requirements: ["Handle three bracket types: (), [], {}", "Empty string is valid", "Single character is invalid"],
    successRate: 72,
    avgTime: "14 min",
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Hard",
    concept: "Design",
    time: "35 min",
    description: "Design a data structure that follows the Least Recently Used (LRU) cache eviction policy. Implement get and put operations in O(1) time.",
    requirements: ["O(1) get and put operations", "Fixed capacity with eviction", "Track access order for recency"],
    successRate: 41,
    avgTime: "28 min",
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600",
  Medium: "bg-yellow-500/10 text-yellow-700",
  Hard: "bg-red-500/10 text-red-600",
};

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export function ExpandableCard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {problems.map((problem, i) => {
        const isExpanded = expandedId === problem.id;

        return (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <motion.div
              className="surface-elevated rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
              whileHover={{ y: -2 }}
              transition={spring}
              onClick={() => setExpandedId(isExpanded ? null : problem.id)}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-3.5 py-3">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                <span className="text-[13px] font-medium text-foreground flex-1">{problem.title}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                  {problem.concept}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {problem.time}
                </div>

                {/* Arrow / Chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={spring}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </motion.div>

                {/* Hover arrow (hidden when expanded) */}
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="hidden group-hover:block"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                )}
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={spring}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5 pt-0 border-t border-border">
                      <motion.p
                        className="text-[12px] text-muted-foreground leading-relaxed mt-3"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.05 }}
                      >
                        {problem.description}
                      </motion.p>

                      <motion.div
                        className="mt-2.5 space-y-1"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.1 }}
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">Requirements</p>
                        {problem.requirements.map((req, j) => (
                          <p key={j} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">{"•"}</span>
                            {req}
                          </p>
                        ))}
                      </motion.div>

                      <motion.div
                        className="mt-3 flex items-center justify-between"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.15 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {problem.successRate}% success
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            avg {problem.avgTime}
                          </span>
                        </div>
                        <motion.button
                          className="text-[11px] font-medium text-primary-foreground bg-primary px-3 py-1 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={spring}
                        >
                          Start Challenge
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
