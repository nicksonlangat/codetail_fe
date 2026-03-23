"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { CountdownTimer } from "@/components/playground/countdown-timer";
import { ColorPalette } from "@/components/playground/color-palette";
import { SplitButton } from "@/components/playground/split-button";
import { DataTableMini } from "@/components/playground/data-table-mini";
import { StepWizard } from "@/components/playground/step-wizard";
import { ModalSystem } from "@/components/playground/modal-system";
import { BreadcrumbNav } from "@/components/playground/breadcrumb-nav";
import { TagInput } from "@/components/playground/tag-input";
import { TooltipShowcase } from "@/components/playground/tooltip-showcase";
import { ProgressSteps } from "@/components/playground/progress-steps";

const sections = [
  { num: "21", title: "Countdown Timer", component: CountdownTimer },
  { num: "22", title: "Color Palette", component: ColorPalette },
  { num: "23", title: "Split Button", component: SplitButton },
  { num: "24", title: "Data Table", component: DataTableMini },
  { num: "25", title: "Step Wizard", component: StepWizard },
  { num: "26", title: "Modal System", component: ModalSystem },
  { num: "27", title: "Breadcrumb Nav", component: BreadcrumbNav },
  { num: "28", title: "Tag Input", component: TagInput },
  { num: "29", title: "Tooltip Showcase", component: TooltipShowcase },
  { num: "30", title: "Progress Steps", component: ProgressSteps },
];

export default function Tranche3Page() {
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
          Tranche 3 — Compound Components
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
          Compound interactive patterns — countdown timers, color systems, split
          actions, data tables, and multi-step wizards with spring physics.
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
