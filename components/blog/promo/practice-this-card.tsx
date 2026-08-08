"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, WandSparkles } from "lucide-react";

type PracticeThisCardProps = {
  challenges: string[];
};

const CHALLENGE_PREVIEWS: Record<string, string> = {
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

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export function PracticeThisCard({ challenges }: PracticeThisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="bg-white border border-brand-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <WandSparkles className="size-3.5 text-brand-primary" />
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Practice what you just learned
        </span>
      </div>

      <p className="text-[12px] text-brand-text-muted mb-4">
        Reinforce your understanding with hands-on challenges on Codetail.
      </p>

      <div className="space-y-2 mb-4">
        {challenges.slice(0, 3).map((slug) => (
          <div key={slug} className="flex items-center gap-2 text-[11px] text-brand-text-muted">
            <div className="size-1 rounded-full bg-brand-primary/60" />
            <span>{CHALLENGE_PREVIEWS[slug] || slug}</span>
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-1.5 w-full text-[12px] font-medium text-white bg-brand-primary hover:bg-brand-primary-hover py-2 rounded-lg cursor-pointer outline-none transition-all duration-500 focus-visible:border focus-visible:border-white/50"
        >
          Start practicing
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
