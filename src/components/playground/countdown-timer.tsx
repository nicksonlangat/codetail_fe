"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const presets = [
  { label: "5 min", seconds: 5 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "25 min", seconds: 25 * 60 },
];

const SIZE = 180;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Phase = "idle" | "running" | "paused" | "done";

export function CountdownTimer() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [phase, setPhase] = useState<Phase>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const start = () => {
    if (remaining <= 0) return;
    setPhase("running");
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setPhase("paused");
    clearTimer();
  };

  const reset = () => {
    clearTimer();
    setPhase("idle");
    setRemaining(totalSeconds);
  };

  const selectPreset = (seconds: number) => {
    clearTimer();
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setPhase("idle");
  };

  const fraction = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const ringColor =
    phase === "done" ? "stroke-green-500" : "stroke-primary";
  const ringDuration = phase === "running" ? 1 : 0.5;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Preset buttons */}
      <div className="flex gap-2">
        {presets.map((p) => (
          <motion.button
            key={p.label}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => selectPreset(p.seconds)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 ${
              totalSeconds === p.seconds && phase === "idle"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* Circular timer */}
      <motion.div
        className="relative cursor-pointer"
        style={{ width: SIZE, height: SIZE }}
        animate={
          phase === "done"
            ? { scale: [1, 1.08, 1] }
            : phase === "paused"
              ? { opacity: [1, 0.5, 1] }
              : { scale: 1, opacity: 1 }
        }
        transition={
          phase === "done"
            ? { ...spring, repeat: 0 }
            : phase === "paused"
              ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.5 }
        }
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-muted"
          />
          {/* Progress ring */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-500`}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              transition: `stroke-dashoffset ${ringDuration}s linear, stroke 0.5s`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              <motion.span
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={spring}
                className="text-xl font-bold text-green-500"
              >
                Done!
              </motion.span>
            ) : (
              <motion.span
                key="time"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-3xl font-mono font-bold tabular-nums text-foreground"
              >
                {mm}:{ss}
              </motion.span>
            )}
          </AnimatePresence>
          {phase !== "done" && (
            <span className="text-[10px] text-muted-foreground mt-1">
              {phase === "running"
                ? "running"
                : phase === "paused"
                  ? "paused"
                  : "ready"}
            </span>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-2">
        {phase === "running" ? (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={pause}
            className="cursor-pointer px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-medium transition-all duration-500 hover:bg-muted/80"
          >
            Pause
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={start}
            disabled={phase === "done"}
            className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium transition-all duration-500 disabled:opacity-40"
          >
            {phase === "paused" ? "Resume" : "Start"}
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={reset}
          className="cursor-pointer px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium transition-all duration-500 hover:text-foreground"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}
