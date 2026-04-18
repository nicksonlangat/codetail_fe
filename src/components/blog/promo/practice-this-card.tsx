"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

type PracticeThisCardProps = {
  challenges: string[];
};

export function PracticeThisCard({ challenges }: PracticeThisCardProps) {
  const challengePreviews: Record<string, string> = {
    "string-reversal": "Reverse a string in-place",
    "palindrome-check": "Check if a string is a palindrome",
    "csv-parser": "Parse CSV data into structured rows",
    "type-detective": "Identify types at runtime",
    "variable-swap": "Swap two variables without temp",
    "tip-calculator": "Calculate tip with custom logic",
    "compound-interest": "Compute compound interest",
    "grade-calculator": "Convert numeric grade to letter",
    "leap-year": "Determine if a year is a leap year",
    "flatten-list": "Flatten nested lists recursively",
    "two-sum": "Find two numbers that sum to target",
    "rotate-array": "Rotate array by k positions",
  };

  const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Practice what you just learned
        </span>
      </div>

      <p className="text-[12px] text-muted-foreground mb-4">
        Reinforce your understanding with hands-on challenges on Codetail.
      </p>

      <div className="space-y-2 mb-4">
        {challenges.slice(0, 3).map((slug) => (
          <div
            key={slug}
            className="flex items-center gap-2 text-[11px] text-muted-foreground"
          >
            <div className="w-1 h-1 rounded-full bg-primary/60" />
            <span>{challengePreviews[slug] || slug}</span>
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-1.5 w-full text-[12px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 py-2 rounded-lg transition-all duration-100"
        >
          Start practicing
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}