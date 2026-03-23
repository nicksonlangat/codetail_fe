"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function CodeBracketIcon({ hovered }: { hovered: boolean }) {
  return (
    <motion.svg
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      width="48" height="48" viewBox="0 0 48 48" fill="none"
    >
      <path
        d="M16 14L8 24L16 34"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-500"
      />
      <path
        d="M32 14L40 24L32 34"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-500"
      />
      <path
        d="M28 10L20 38"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2" strokeLinecap="round"
        className="transition-all duration-500"
        opacity={0.5}
      />
    </motion.svg>
  );
}

function FlameIcon({ hovered }: { hovered: boolean }) {
  return (
    <motion.svg
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      width="48" height="48" viewBox="0 0 48 48" fill="none"
    >
      <path
        d="M24 6C24 6 14 18 14 28C14 33.5228 18.4772 38 24 38C29.5228 38 34 33.5228 34 28C34 18 24 6 24 6Z"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-500"
        fill="none"
      />
      <path
        d="M24 22C24 22 20 26 20 30C20 32.2091 21.7909 34 24 34C26.2091 34 28 32.2091 28 30C28 26 24 22 24 22Z"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2" strokeLinecap="round"
        className="transition-all duration-500"
        fill="none" opacity={0.6}
      />
    </motion.svg>
  );
}

function CheckCircleIcon({ hovered }: { hovered: boolean }) {
  return (
    <motion.svg
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      width="48" height="48" viewBox="0 0 48 48" fill="none"
    >
      <circle
        cx="24" cy="24" r="16"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2.5"
        className="transition-all duration-500"
        fill="none"
      />
      <path
        d="M17 24L22 29L31 19"
        stroke={hovered ? "currentColor" : "hsl(var(--muted-foreground))"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="transition-all duration-500"
      />
    </motion.svg>
  );
}

function ConfettiDots() {
  const dots = [
    { x: -20, y: -18, delay: 0 },
    { x: 22, y: -15, delay: 0.05 },
    { x: -15, y: 16, delay: 0.1 },
    { x: 18, y: 20, delay: 0.15 },
    { x: -25, y: 2, delay: 0.08 },
    { x: 26, y: -3, delay: 0.12 },
    { x: 0, y: -24, delay: 0.03 },
    { x: 5, y: 22, delay: 0.18 },
  ];

  return (
    <>
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: dot.x, y: dot.y, scale: 1, opacity: [0, 1, 0.6] }}
          transition={{ ...spring, delay: 0.3 + dot.delay }}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          style={{ left: "50%", top: "50%" }}
        />
      ))}
    </>
  );
}

const cards = [
  {
    title: "No problems solved yet",
    subtitle: "Start your first challenge and begin your coding journey.",
    cta: "Start your first challenge",
    Icon: CodeBracketIcon,
    confetti: false,
  },
  {
    title: "No active streaks",
    subtitle: "Consistency is key. Solve one problem today to start a streak.",
    cta: "Begin your streak today",
    Icon: FlameIcon,
    confetti: false,
  },
  {
    title: "Inbox zero",
    subtitle: "All caught up! No pending reviews or notifications.",
    cta: null,
    Icon: CheckCircleIcon,
    confetti: true,
  },
];

export function EmptyStates() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="py-4 grid gap-4 sm:grid-cols-3">
      {cards.map((card, i) => {
        const isHovered = hoveredCard === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.1 }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`rounded-xl bg-card border border-border/50 p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-500 ${
              isHovered ? "border-primary/30" : ""
            }`}
          >
            <div className={`relative mb-4 ${isHovered ? "text-primary" : "text-muted-foreground"} transition-all duration-500`}>
              <card.Icon hovered={isHovered} />
              {card.confetti && <ConfettiDots />}
            </div>

            <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-1">
              {card.title}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              {card.subtitle}
            </p>

            {card.cta && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="cursor-pointer px-4 py-2 rounded-lg bg-primary/10 text-primary text-[11px] font-medium transition-all duration-500 hover:bg-primary/20"
              >
                {card.cta}
              </motion.button>
            )}

            {!card.cta && (
              <span className="text-[11px] font-medium text-primary">
                All caught up!
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
