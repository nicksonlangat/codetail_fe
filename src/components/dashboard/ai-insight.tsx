"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/progress";

export function AiInsight() {
  const [dismissed, setDismissed] = useState(false);
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 30000,
  });

  if (dismissed || !dashboard?.next_problem_path_slug) return null;

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
          You&apos;re {dashboard.remaining_in_closest} problem{dashboard.remaining_in_closest !== 1 ? "s" : ""} away from completing{" "}
          <span className="font-medium">{dashboard.next_problem_path_title}</span>.
          <Link
            href={`/paths/${dashboard.next_problem_path_slug}`}
            className="inline-flex items-center gap-0.5 text-primary font-medium ml-1 hover:underline underline-offset-2 cursor-pointer"
          >
            Continue path <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          AI recommendation based on your path progress
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-75 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
