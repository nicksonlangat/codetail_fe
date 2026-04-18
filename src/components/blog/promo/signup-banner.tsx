"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function SignupBanner() {
  const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.05 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5"
    >
      <h3 className="text-[13px] font-semibold text-foreground mb-2">
        Master Python with hands-on practice
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Real challenges, not LeetCode puzzles. Free to start.
      </p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-all duration-100"
        >
          Create free account
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}