"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { KanbanBoard } from "@/components/playground/kanban-board";
import { TypewriterText } from "@/components/playground/typewriter-text";
import { RatingStars } from "@/components/playground/rating-stars";
import { FlipCard } from "@/components/playground/flip-card";
import { TimelineFeed } from "@/components/playground/timeline-feed";
import { NumberTicker } from "@/components/playground/number-ticker";
import { PasswordStrength } from "@/components/playground/password-strength";
import { ComparisonCard } from "@/components/playground/comparison-card";
import { CommandMenu } from "@/components/playground/command-menu";
import { GaugeChart } from "@/components/playground/gauge-chart";

const sections = [
  { num: "31", title: "Kanban Board", component: KanbanBoard },
  { num: "32", title: "Typewriter Text", component: TypewriterText },
  { num: "33", title: "Rating Stars", component: RatingStars },
  { num: "34", title: "Flip Cards", component: FlipCard },
  { num: "35", title: "Timeline Feed", component: TimelineFeed },
  { num: "36", title: "Number Ticker", component: NumberTicker },
  { num: "37", title: "Password Strength", component: PasswordStrength },
  { num: "38", title: "Before/After Comparison", component: ComparisonCard },
  { num: "39", title: "Command Menu", component: CommandMenu },
  { num: "40", title: "Gauge Chart", component: GaugeChart },
];

export default function Tranche4Page() {
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
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer"
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
          Tranche 4 — Rich Patterns
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
          Rich interactive patterns — kanban boards, typewriter effects, rating
          systems, flip cards, timelines, animated tickers, strength meters,
          comparison views, command palettes, and gauge charts with spring physics.
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
