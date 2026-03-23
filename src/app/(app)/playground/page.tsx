"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Palette, Sparkles, Layers, MousePointer2, BarChart3, Gem } from "lucide-react";

const tranches = [
  {
    id: "tranche-1",
    title: "Tranche 1 — Atoms & Micro-interactions",
    description: "Score rings, status badges, spring buttons, streak counters, code blocks",
    icon: Sparkles,
    count: 10,
  },
  {
    id: "tranche-2",
    title: "Tranche 2 — Interactions & Data Display",
    description: "Tabs, sparklines, OTP input, skeletons, segmented controls",
    icon: MousePointer2,
    count: 10,
  },
  {
    id: "tranche-3",
    title: "Tranche 3 — Compound Components",
    description: "Countdown timer, color palette, split buttons, data tables, step wizards",
    icon: Layers,
    count: 10,
  },
  {
    id: "tranche-4",
    title: "Tranche 4 — Rich Patterns",
    description: "Kanban boards, typewriter text, ratings, flip cards, timelines",
    icon: BarChart3,
    count: 10,
  },
  {
    id: "tranche-5",
    title: "Tranche 5 — Polish & Delight",
    description: "Infinite scroll, accordions, heatmaps, switchers, empty states",
    icon: Gem,
    count: 10,
  },
];

export default function PlaygroundIndex() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            Design System
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Living design explorations — spring physics, tinted surfaces, engineered minimalism.
        </p>
      </motion.div>

      <div className="space-y-3">
        {tranches.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.05 }}
            >
              <Link href={`/playground/${t.id}`}>
                <div className="group surface-interactive rounded-xl p-4 flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[13px] font-semibold tracking-tight">{t.title}</h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums">
                    {t.count} designs
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
