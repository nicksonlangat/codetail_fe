"use client";

import { motion } from "framer-motion";
import { Check, User, Mail, Sparkles } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const steps = [
  { label: "Create account", icon: User },
  { label: "Verify email", icon: Mail },
  { label: "Start learning", icon: Sparkles },
];

interface SignupStepsProps {
  current: number; // 0-indexed: 0 = signup, 1 = verify, 2 = done
}

export function SignupSteps({ current }: SignupStepsProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const completed = i < current;
        const active = i === current;
        const Icon = step.icon;

        return (
          <div key={step.label} className="flex items-center">
            {/* Node */}
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                  completed
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "border border-border bg-card text-muted-foreground/30"
                }`}
                animate={active ? { scale: [1, 1.08, 1] } : {}}
                transition={active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : spring}
              >
                {completed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium transition-all duration-500 ${
                  completed
                    ? "text-primary"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="w-8 h-[1.5px] mx-2 bg-border/40 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: completed ? "100%" : "0%" }}
                  transition={spring}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
