"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function AiInsight() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 px-4 py-3 rounded-lg bg-accent/50 ring-1 ring-primary/10"
    >
      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-foreground leading-relaxed">
          You&apos;re 3 problems away from completing{" "}
          <span className="font-medium">Arrays &amp; Strings</span>.
          <Link
            href="/paths/arrays-strings"
            className="inline-flex items-center gap-0.5 text-primary font-medium ml-1 hover:underline underline-offset-2"
          >
            Continue path <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          AI recommendation based on your path progress
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors duration-75 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
