"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Lightbulb } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const cards = [
  {
    question: "What data structure?",
    answer: "Hash Map — O(1) lookup",
    accent: "bg-primary/10 border-primary/20",
    accentDot: "bg-primary",
  },
  {
    question: "Time complexity?",
    answer: "O(n log n) — sorting dominates",
    accent: "bg-blue-500/10 border-blue-500/20",
    accentDot: "bg-blue-500",
  },
  {
    question: "Space optimization?",
    answer: "Two pointers — O(1) extra space",
    accent: "bg-purple-500/10 border-purple-500/20",
    accentDot: "bg-purple-500",
  },
];

function FlipCardItem({
  question,
  answer,
  accent,
  accentDot,
}: (typeof cards)[0]) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: 600 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={spring}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-[160px]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl bg-card border border-border/30 p-4 flex flex-col items-center justify-center gap-3 transition-all duration-500"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-[13px] font-semibold text-foreground text-center tracking-tight">
            {question}
          </p>
          <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">
            Hover to reveal
          </span>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-all duration-500 ${accent}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`w-10 h-10 rounded-full ${accentDot}/15 flex items-center justify-center`}
          >
            <Lightbulb className={`w-5 h-5 text-foreground`} />
          </div>
          <p className="text-[13px] font-semibold text-foreground text-center tracking-tight">
            {answer}
          </p>
          <div className={`w-6 h-0.5 rounded-full ${accentDot}`} />
        </div>
      </motion.div>
    </div>
  );
}

export function FlipCard() {
  return (
    <div className="py-6">
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <FlipCardItem key={card.question} {...card} />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/50 text-center mt-4">
        Hover over a card to reveal the answer
      </p>
    </div>
  );
}
