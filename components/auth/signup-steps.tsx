"use client";

import { motion } from "framer-motion";
import { Check, User, Mail, WandSparkles } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const STEPS = [
  { label: "Create account", icon: User },
  { label: "Verify email", icon: Mail },
  { label: "Start learning", icon: WandSparkles },
];

interface SignupStepsProps {
  current: number;
}

export function SignupSteps({ current }: SignupStepsProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const completed = i < current;
        const active = i === current;
        const Icon = step.icon;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <motion.div
                className={`size-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                  completed
                    ? "bg-brand-primary text-white"
                    : active
                      ? "border-2 border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border border-brand-border bg-white text-brand-text-subtle"
                }`}
                animate={active ? { scale: [1, 1.08, 1] } : {}}
                transition={active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : SPRING}
              >
                {completed ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING}>
                    <Check className="size-3" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <Icon className="size-3" />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium transition-all duration-500 ${
                  completed
                    ? "text-brand-primary"
                    : active
                      ? "text-brand-text"
                      : "text-brand-text-subtle"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="w-8 h-[1.5px] mx-2 bg-brand-border relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-brand-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: completed ? "100%" : "0%" }}
                  transition={SPRING}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
