"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export function SignupBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: 0.05 }}
      className="bg-brand-primary-tint border border-brand-primary-soft/40 rounded-xl p-5"
    >
      <h3 className="text-[13px] font-semibold text-brand-text mb-2">
        Master Python with hands-on practice
      </h3>
      <p className="text-[11px] text-brand-text-muted mb-4">
        Real challenges, not LeetCode puzzles. Free to start.
      </p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-brand-primary hover:bg-brand-primary-hover px-4 py-2 rounded-lg cursor-pointer outline-none transition-all duration-500 focus-visible:border focus-visible:border-white/50"
        >
          Create free account
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
