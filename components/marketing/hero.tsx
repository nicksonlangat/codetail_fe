"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };
const TAP = { type: "spring" as const, stiffness: 400, damping: 25 };

export function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-48 pb-32 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ENTRANCE}
        className="text-4xl sm:text-5xl font-semibold tracking-tight text-brand-text leading-tight"
      >
        Write real code. <span className="text-brand-primary">Get real feedback.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTRANCE, delay: 0.05 }}
        className="mt-5 max-w-xl text-base text-brand-text-muted"
      >
        Codetail is where developers practice with sandboxed execution, AI code review, and
        problems pulled from real production patterns, not toy exercises.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTRANCE, delay: 0.1 }}
        className="mt-8 flex items-center gap-3"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={TAP}>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary text-white text-sm font-medium px-5 py-2.5 cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover"
          >
            Get started
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={TAP}>
          <Link
            href="/paths"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border text-brand-text text-sm font-medium px-5 py-2.5 cursor-pointer transition-all duration-500 hover:bg-brand-surface"
          >
            Explore paths <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
