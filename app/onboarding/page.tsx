"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Code2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { SignupSteps } from "@/components/auth/signup-steps";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

const STACKS = [
  { id: "python", label: "Python" },
  { id: "django", label: "Django" },
  { id: "fastapi", label: "FastAPI" },
  { id: "sql", label: "SQL" },
  { id: "go", label: "Go" },
];

const GOALS = [
  {
    id: "job",
    label: "Land my next job",
    description: "Practice the patterns real interviews and codebases actually use.",
  },
  {
    id: "better",
    label: "Get better at my current job",
    description: "Sharpen skills you use day to day.",
  },
  {
    id: "interview",
    label: "Prep for technical interviews",
    description: "Focus on problems close to what you'll actually be asked.",
  },
  {
    id: "fun",
    label: "Learn for fun",
    description: "No pressure, just build and explore.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [stacks, setStacks] = useState<string[]>([]);
  const [goal, setGoal] = useState<string | null>(null);

  function toggleStack(id: string) {
    setStacks((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Topbar />

      <div className="relative flex items-center justify-center min-h-screen px-6 py-24">
        <div
          aria-hidden
          className="absolute inset-x-0 top-20 h-100 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ENTRANCE}
          className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl shadow-brand-primary/5 p-10"
        >
          <SignupSteps current={2} />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="stacks"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={SPRING}
              >
                <h1 className="text-xl font-semibold text-brand-text">What are you learning?</h1>
                <p className="text-[13px] text-brand-text-muted mt-1 mb-6">
                  Pick as many as you like. You can change this anytime.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STACKS.map((s) => {
                    const active = stacks.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleStack(s.id)}
                        className={`relative flex items-center gap-2.5 rounded-lg border p-3.5 text-left cursor-pointer outline-none transition-all duration-500 ${
                          active
                            ? "border-brand-primary bg-brand-primary/5"
                            : "border-brand-border hover:bg-brand-surface focus-visible:border-brand-primary/50"
                        }`}
                      >
                        <span
                          className={`size-8 rounded-md flex items-center justify-center shrink-0 ${
                            active
                              ? "bg-brand-primary/15 text-brand-primary"
                              : "bg-brand-surface text-brand-text-muted"
                          }`}
                        >
                          <Code2 className="size-4" />
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            active ? "text-brand-text" : "text-brand-text-muted"
                          }`}
                        >
                          {s.label}
                        </span>
                        {active && (
                          <Check className="size-3.5 text-brand-primary absolute top-2.5 right-2.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={stacks.length === 0}
                  whileHover={stacks.length ? { y: -1 } : {}}
                  whileTap={stacks.length ? { scale: 0.985 } : {}}
                  transition={SPRING}
                  className="w-full h-10 mt-8 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50"
                >
                  Continue <ArrowRight className="size-3.5" />
                </motion.button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={SPRING}
              >
                <h1 className="text-xl font-semibold text-brand-text">What&apos;s your goal?</h1>
                <p className="text-[13px] text-brand-text-muted mt-1 mb-6">
                  This helps us prioritize what to show you first.
                </p>

                <div className="space-y-2.5">
                  {GOALS.map((g) => {
                    const active = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGoal(g.id)}
                        className={`w-full flex items-start gap-3 rounded-lg border p-3.5 text-left cursor-pointer outline-none transition-all duration-500 ${
                          active
                            ? "border-brand-primary bg-brand-primary/5"
                            : "border-brand-border hover:bg-brand-surface focus-visible:border-brand-primary/50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0 ${
                            active ? "border-brand-primary bg-brand-primary" : "border-brand-border"
                          }`}
                        >
                          {active && <Check className="size-2.5 text-white" strokeWidth={3} />}
                        </span>
                        <span>
                          <p
                            className={`text-sm font-medium ${
                              active ? "text-brand-text" : "text-brand-text-muted"
                            }`}
                          >
                            {g.label}
                          </p>
                          <p className="text-[12px] text-brand-text-subtle mt-0.5">
                            {g.description}
                          </p>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="h-10 px-4 rounded-lg border border-brand-border text-brand-text-muted text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface focus-visible:border-brand-primary/50"
                  >
                    Back
                  </button>
                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!goal}
                    whileHover={goal ? { y: -1 } : {}}
                    whileTap={goal ? { scale: 0.985 } : {}}
                    transition={SPRING}
                    className="flex-1 h-10 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50"
                  >
                    Continue <ArrowRight className="size-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={SPRING}
                  className="size-14 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="size-6 text-brand-primary" strokeWidth={3} />
                </motion.div>
                <h1 className="text-xl font-semibold text-brand-text">You&apos;re all set</h1>
                <p className="text-[13px] text-brand-text-muted mt-1 mb-8">
                  Time to write some real code.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium px-5 py-2.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover focus-visible:border-white/50"
                >
                  Start practicing <ArrowRight className="size-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
