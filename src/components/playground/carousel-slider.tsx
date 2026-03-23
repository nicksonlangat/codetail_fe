"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Link2,
  TreePine,
  Zap,
  Network,
  Server,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const paths = [
  { icon: Layers, title: "Arrays", problems: 24, difficulty: "Easy" },
  { icon: Link2, title: "Linked Lists", problems: 18, difficulty: "Medium" },
  { icon: TreePine, title: "Trees", problems: 22, difficulty: "Medium" },
  { icon: Zap, title: "Dynamic Prog.", problems: 30, difficulty: "Hard" },
  { icon: Network, title: "Graphs", problems: 20, difficulty: "Hard" },
  { icon: Server, title: "System Design", problems: 15, difficulty: "Advanced" },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500",
  Advanced: "text-purple-500",
};

export function CarouselSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, paths.length - 1));
    setActive(clamped);
    scrollRef.current?.scrollTo({
      left: clamped * 216,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / 216);
    setActive(Math.max(0, Math.min(idx, paths.length - 1)));
  };

  return (
    <div className="space-y-4">
      {/* Carousel */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Arrow buttons */}
        <button
          onClick={() => scrollTo(active - 1)}
          className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-500 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scrollTo(active + 1)}
          className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-500 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-10 py-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {paths.map((path, i) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.title}
                className="cursor-pointer flex-shrink-0 w-[200px] rounded-xl border border-border/50 bg-card p-4 snap-center"
                whileHover={{ rotateY: 3, scale: 1.02 }}
                transition={spring}
                style={{ perspective: 800 }}
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  {path.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {path.problems} problems
                </p>
                <p className={`text-[11px] font-medium mt-1 ${difficultyColor[path.difficulty]}`}>
                  {path.difficulty}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5">
        {paths.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => scrollTo(i)}
            className="cursor-pointer rounded-full transition-all duration-500"
            animate={{
              width: active === i ? 8 : 5,
              height: active === i ? 8 : 5,
              backgroundColor: active === i ? "var(--color-primary)" : "var(--color-muted-foreground)",
              opacity: active === i ? 1 : 0.35,
            }}
            transition={spring}
          />
        ))}
      </div>
    </div>
  );
}
