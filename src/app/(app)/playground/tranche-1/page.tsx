"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { ScoreRing } from "@/components/playground/score-ring";
import { StatusBadges } from "@/components/playground/status-badges";
import { SpringButtons } from "@/components/playground/spring-buttons";
import { StreakFire } from "@/components/playground/streak-fire";
import { CodeBlock } from "@/components/playground/code-block";
import { ProgressPath } from "@/components/playground/progress-path";
import { KeyboardHints } from "@/components/playground/keyboard-hints";
import { ToastSystem } from "@/components/playground/toast-system";
import { ExpandableCard } from "@/components/playground/expandable-card";
import { DifficultyMeter } from "@/components/playground/difficulty-meter";

const sections = [
  { num: "01", title: "Score Ring", component: ScoreRing },
  { num: "02", title: "Status Badges", component: StatusBadges },
  { num: "03", title: "Spring Buttons", component: SpringButtons },
  { num: "04", title: "Streak Fire", component: StreakFire },
  { num: "05", title: "Code Block", component: CodeBlock },
  { num: "06", title: "Progress Path", component: ProgressPath },
  { num: "07", title: "Keyboard Hints", component: KeyboardHints },
  { num: "08", title: "Toast System", component: ToastSystem },
  { num: "09", title: "Expandable Card", component: ExpandableCard },
  { num: "10", title: "Difficulty Meter", component: DifficultyMeter },
];

export default function Tranche1Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Link
          href="/playground"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Playground
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
      >
        <h1 className="text-xl font-semibold tracking-tight">
          Tranche 1 — Atoms & Micro-interactions
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
          Foundational building blocks exploring spring physics, tinted surfaces,
          and the Codetail teal palette. Each component is self-contained and
          ready to compose into larger patterns.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-0">
        {sections.map((section, i) => {
          const Component = section.component;
          return (
            <motion.section
              key={section.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1 + i * 0.07,
              }}
            >
              {/* Divider (except before first) */}
              {i > 0 && (
                <div className="border-t border-border/50 my-10" />
              )}

              {/* Section label */}
              <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-4">
                {section.num} — {section.title}
              </p>

              {/* Component */}
              <Component />
            </motion.section>
          );
        })}
      </div>
    </main>
  );
}
