"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };
const TAP = { type: "spring" as const, stiffness: 400, damping: 25 };

export function FinalCta() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={ENTRANCE}
        className="rounded-2xl bg-brand-primary px-8 py-16 sm:py-20 flex flex-col items-center text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white max-w-lg">
          Ready to write real code?
        </h2>
        <p className="mt-3 text-sm text-white/80 max-w-md">
          Join developers practicing with sandboxed execution and AI review. Free to start, no
          credit card required.
        </p>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={TAP}
          className="mt-7"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white text-brand-primary text-sm font-medium px-5 py-2.5 cursor-pointer transition-all duration-500 hover:bg-white/90"
          >
            Get started
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
