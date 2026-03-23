"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { InfiniteScroll } from "@/components/playground/infinite-scroll";
import { AccordionFaq } from "@/components/playground/accordion-faq";
import { HeatmapInteractive } from "@/components/playground/heatmap-interactive";
import { SwitcherDropdown } from "@/components/playground/switcher-dropdown";
import { EmptyStates } from "@/components/playground/empty-states";
import { LiveIndicator } from "@/components/playground/live-indicator";
import { CarouselSlider } from "@/components/playground/carousel-slider";
import { ConfettiBurst } from "@/components/playground/confetti-burst";
import { MorphingIcon } from "@/components/playground/morphing-icon";
import { TextReveal } from "@/components/playground/text-reveal";

const sections = [
  { num: "41", title: "Infinite Scroll", component: InfiniteScroll },
  { num: "42", title: "FAQ Accordion", component: AccordionFaq },
  { num: "43", title: "Contribution Heatmap", component: HeatmapInteractive },
  { num: "44", title: "Workspace Switcher", component: SwitcherDropdown },
  { num: "45", title: "Empty States", component: EmptyStates },
  { num: "46", title: "Live Indicators", component: LiveIndicator },
  { num: "47", title: "Card Carousel", component: CarouselSlider },
  { num: "48", title: "Confetti Burst", component: ConfettiBurst },
  { num: "49", title: "Morphing Icons", component: MorphingIcon },
  { num: "50", title: "Text Reveal", component: TextReveal },
];

export default function Tranche5Page() {
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
          Tranche 5 — Polish & Delight
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
          Polish and delight patterns — infinite scroll, accordions, heatmaps,
          workspace switchers, empty states, live indicators, card carousels,
          confetti celebrations, morphing icons, and text reveals with spring physics.
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
