"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const RULES = [
  { key: "len", label: "8+ chars", test: (p: string) => p.length >= 8 },
  { key: "up", label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { key: "low", label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { key: "num", label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { key: "spc", label: "Special", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function strengthColor(score: number) {
  if (score <= 20) return "bg-brand-destructive";
  if (score <= 40) return "bg-brand-warning";
  if (score <= 80) return "bg-brand-success";
  return "bg-brand-primary";
}

export function passwordScore(password: string) {
  if (password.length === 0) return 0;
  return RULES.filter((r) => r.test(password)).length * 20;
}

export function PasswordStrength({ password }: { password: string }) {
  const met = RULES.map((r) => r.test(password));
  const score = passwordScore(password);

  return (
    <AnimatePresence>
      {password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-2">
            <div className="h-[3px] rounded-full bg-brand-border overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${strengthColor(score)}`}
                animate={{ width: `${score}%` }}
                transition={SPRING}
              />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {RULES.map((r, i) => (
                <div key={r.key} className="flex items-center gap-1">
                  <motion.span
                    animate={{ scale: met[i] ? 1 : 0.8, opacity: met[i] ? 1 : 0.3 }}
                    transition={SPRING}
                    className={`size-3.5 rounded-full flex items-center justify-center transition-all duration-500 ${
                      met[i] ? "bg-brand-primary/10 text-brand-primary" : "text-brand-text-subtle"
                    }`}
                  >
                    {met[i] ? <Check className="size-2" /> : <X className="size-2" />}
                  </motion.span>
                  <span
                    className={`text-[10px] transition-all duration-500 ${
                      met[i] ? "text-brand-text-muted" : "text-brand-text-subtle"
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
