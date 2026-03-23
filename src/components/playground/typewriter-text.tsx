"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Type, Hash, Clock } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const FULL_TEXT =
  "Master algorithms through practice, not memorization. Every problem you solve builds intuition.";
const CHAR_DELAY = 40;

export function TypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const indexRef = useRef(0);
  const blinkCountRef = useRef(0);

  const type = useCallback(() => {
    indexRef.current = 0;
    blinkCountRef.current = 0;
    setDisplayed("");
    setDone(false);
    setShowStats(false);
    setCursorVisible(true);
    setCharCount(0);
    setWordCount(0);
  }, []);

  useEffect(() => {
    type();
  }, [type]);

  useEffect(() => {
    if (done) return;
    if (indexRef.current >= FULL_TEXT.length) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => {
      indexRef.current += 1;
      setDisplayed(FULL_TEXT.slice(0, indexRef.current));
    }, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [displayed, done]);

  // Blink cursor 3 times after done, then hide
  useEffect(() => {
    if (!done) return;
    if (blinkCountRef.current >= 6) {
      setCursorVisible(false);
      setShowStats(true);
      return;
    }
    const timer = setTimeout(() => {
      blinkCountRef.current += 1;
      setCursorVisible((v) => !v);
    }, 400);
    return () => clearTimeout(timer);
  }, [done, cursorVisible]);

  // Animate stat counters
  useEffect(() => {
    if (!showStats) return;
    const target = FULL_TEXT.length;
    const targetWords = FULL_TEXT.split(/\s+/).length;
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      setCharCount(Math.round((frame / totalFrames) * target));
      setWordCount(Math.round((frame / totalFrames) * targetWords));
      if (frame >= totalFrames) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [showStats]);

  const stats = [
    { label: "Characters", value: charCount, icon: Type },
    { label: "Words", value: wordCount, icon: Hash },
    { label: "Time", value: "3.8s", icon: Clock },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Text display */}
      <div className="bg-card rounded-xl p-5 border border-border/30">
        <p className="text-sm text-foreground leading-relaxed font-medium min-h-[48px]">
          {displayed}
          {cursorVisible && (
            <span className="inline-block w-[2px] h-[16px] bg-primary ml-0.5 align-middle" />
          )}
        </p>
      </div>

      {/* Replay button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={type}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium transition-all duration-500 hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" />
          Replay
        </motion.button>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="bg-muted/50 rounded-lg p-3 text-center"
              >
                <Icon className="w-3.5 h-3.5 text-primary mx-auto mb-1.5" />
                <div className="text-lg font-bold font-mono tabular-nums text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
