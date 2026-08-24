"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { designChallenges } from "@/content/system-design-challenges/registry";

const DIFFICULTY_STYLES = {
  Medium: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
  Hard: "bg-brand-destructive/10 text-brand-destructive border-brand-destructive/20",
  Expert: "bg-purple-50 text-purple-600 border-purple-200",
};

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function SystemDesignPage() {
  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-1.5">
          System Design
        </p>
        <h1 className="text-2xl font-bold text-brand-text">Design Challenges</h1>
        <p className="mt-1.5 text-sm text-brand-text-muted max-w-xl">
          Structured interview-style challenges. Read the brief, fill in your design across five sections, get AI feedback on your trade-offs.
        </p>
      </div>

      <Link
        href="/system-design/guide"
        className="group flex items-center justify-between gap-4 mb-8 rounded-xl border border-brand-primary/30 bg-brand-primary/5 px-5 py-4 cursor-pointer transition-all duration-500 hover:border-brand-primary/60 hover:bg-brand-primary/10"
      >
        <div className="flex items-center gap-3">
          <span className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-4 text-brand-primary" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-text">New here? Read the guide first</p>
            <p className="text-[12px] text-brand-text-muted">
              The 4-phase framework, common mistakes, and how to think through trade-offs under pressure.
            </p>
          </div>
        </div>
        <ArrowRight className="size-4 text-brand-primary shrink-0 opacity-60 group-hover:opacity-100 transition-all duration-500" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designChallenges.map((challenge, i) => (
          <motion.div
            key={challenge.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP, delay: i * 0.05 }}
          >
            <Link
              href={`/system-design/${challenge.slug}`}
              className="group flex flex-col h-full rounded-xl border border-brand-border bg-white p-5 cursor-pointer transition-all duration-500 hover:border-brand-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-2xl">{challenge.icon}</span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-brand-text mb-1 group-hover:text-brand-primary transition-all duration-500">
                {challenge.title}
              </h2>
              <p className="text-[12px] text-brand-text-muted leading-5 flex-1">
                {challenge.subtitle}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {challenge.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium text-brand-text-subtle bg-brand-surface px-2 py-0.5 rounded-md border border-brand-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-brand-text-subtle shrink-0 ml-2">
                  <Clock className="size-3" />
                  {challenge.estimatedMinutes}m
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="text-[12px] font-medium text-brand-primary">
                  Start challenge
                </span>
                <ArrowRight className="size-3.5 text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Coming soon placeholder */}
        <div className="flex flex-col h-full rounded-xl border border-dashed border-brand-border bg-brand-surface/30 p-5 items-center justify-center min-h-[200px] gap-2">
          <Cpu className="size-5 text-brand-text-subtle" />
          <p className="text-[12px] text-brand-text-subtle text-center">More challenges coming soon</p>
        </div>
      </div>
    </div>
  );
}
