"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 200, damping: 20 };

const heading = "Build real skills through deliberate practice";
const words = heading.split(" ");

const bodyLines = [
  "Master algorithms and data structures with hands-on challenges.",
  "Track your progress and identify areas for improvement.",
  "Join a community of engineers committed to growth.",
];

export function TextReveal() {
  const [key, setKey] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [highlightRunning, setHighlightRunning] = useState(false);

  const replay = useCallback(() => {
    setKey((k) => k + 1);
    setHighlightIdx(-1);
    setHighlightRunning(false);
  }, []);

  const runHighlight = useCallback(() => {
    if (highlightRunning) return;
    setHighlightRunning(true);
    setHighlightIdx(-1);
    let i = 0;
    const interval = setInterval(() => {
      setHighlightIdx(i);
      i++;
      if (i >= words.length) {
        clearInterval(interval);
        setHighlightRunning(false);
      }
    }, 180);
  }, [highlightRunning]);

  const totalHeadingDelay = words.length * 0.08;
  const totalBodyDelay = totalHeadingDelay + 0.3;

  return (
    <div className="space-y-10">
      {/* Word-by-word reveal */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-4">
          Word-by-Word Reveal
        </p>
        <AnimatePresence mode="wait">
          <motion.div key={key}>
            {/* Heading */}
            <h2 className="text-xl font-semibold tracking-tight leading-relaxed">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...spring,
                    delay: i * 0.08,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            {/* Body lines */}
            <div className="mt-4 space-y-1.5">
              {bodyLines.map((line, i) => (
                <motion.p
                  key={i}
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...spring,
                    delay: totalBodyDelay + i * 0.12,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className="cursor-pointer mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-500"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...spring,
                delay: totalBodyDelay + bodyLines.length * 0.12 + 0.2,
              }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={replay}
          className="cursor-pointer mt-4 text-xs text-muted-foreground hover:text-foreground transition-all duration-500"
          whileTap={{ scale: 0.95 }}
        >
          Replay
        </motion.button>
      </div>

      {/* Highlight / Karaoke variant */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-4">
          Karaoke Highlight
        </p>
        <h2 className="text-xl font-semibold tracking-tight leading-relaxed">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.3em] transition-all duration-500"
              style={{
                color:
                  i <= highlightIdx
                    ? "var(--color-foreground)"
                    : "var(--color-muted-foreground)",
                opacity: i <= highlightIdx ? 1 : 0.35,
              }}
            >
              {word}
            </span>
          ))}
        </h2>
        <motion.button
          onClick={runHighlight}
          className="cursor-pointer mt-4 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-500"
          whileTap={{ scale: 0.95 }}
        >
          {highlightRunning ? "Running..." : "Play Highlight"}
        </motion.button>
      </div>
    </div>
  );
}
