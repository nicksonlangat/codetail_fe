"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const steps = [
  { num: 1, title: "Select Topic" },
  { num: 2, title: "Choose Difficulty" },
  { num: 3, title: "Set Timer" },
  { num: 4, title: "Start" },
];

const topics = ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Strings"];
const difficulties = [
  { label: "Easy", color: "text-green-500 border-green-500/30 bg-green-500/5" },
  { label: "Medium", color: "text-orange-500 border-orange-500/30 bg-orange-500/5" },
  { label: "Hard", color: "text-red-500 border-red-500/30 bg-red-500/5" },
];
const times = ["5 min", "15 min", "25 min", "45 min"];

function StepContent({
  step,
  selections,
  onSelect,
}: {
  step: number;
  selections: Record<string, string>;
  onSelect: (key: string, val: string) => void;
}) {
  if (step === 1) {
    return (
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <motion.button
            key={t}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => onSelect("topic", t)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 ${
              selections.topic === t
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </motion.button>
        ))}
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="flex gap-3">
        {difficulties.map((d) => (
          <motion.button
            key={d.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => onSelect("difficulty", d.label)}
            className={`cursor-pointer px-4 py-3 rounded-lg border text-xs font-semibold transition-all duration-500 ${
              selections.difficulty === d.label
                ? d.color + " border-current"
                : "border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.label}
          </motion.button>
        ))}
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="flex gap-2">
        {times.map((t) => (
          <motion.button
            key={t}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => onSelect("time", t)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 ${
              selections.time === t
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </motion.button>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Topic: <span className="text-foreground font-medium">{selections.topic || "—"}</span></p>
        <p>Difficulty: <span className="text-foreground font-medium">{selections.difficulty || "—"}</span></p>
        <p>Timer: <span className="text-foreground font-medium">{selections.time || "—"}</span></p>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className="cursor-pointer px-5 py-2 rounded-lg bg-primary text-white text-xs font-medium transition-all duration-500"
      >
        Begin Practice
      </motion.button>
    </div>
  );
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function StepWizard() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const next = () => {
    if (current < steps.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  };
  const back = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const onSelect = (key: string, val: string) => {
    setSelections((s) => ({ ...s, [key]: val }));
  };

  return (
    <div className="py-6 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;
          return (
            <div key={step.num} className="flex items-center">
              {/* Circle */}
              <motion.div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted-foreground/50"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={spring}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="num"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={spring}
                    >
                      {step.num}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="relative w-12 h-0.5 bg-border mx-1">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={spring}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step title */}
      <p className="text-center text-xs font-medium text-muted-foreground">
        {steps[current].title}
      </p>

      {/* Step content */}
      <div className="min-h-[80px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="flex justify-center"
          >
            <StepContent
              step={current + 1}
              selections={selections}
              onSelect={onSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={back}
          disabled={current === 0}
          className="cursor-pointer px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium transition-all duration-500 hover:text-foreground disabled:opacity-30"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={next}
          disabled={current === steps.length - 1}
          className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium transition-all duration-500 disabled:opacity-30"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
