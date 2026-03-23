"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const requirements = [
  { key: "length", label: "8+ characters", test: (p: string) => p.length >= 8 },
  { key: "upper", label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { key: "lower", label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { key: "number", label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { key: "special", label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrengthInfo(score: number) {
  if (score <= 20) return { label: "Very Weak", color: "bg-red-500" };
  if (score <= 40) return { label: "Weak", color: "bg-orange-500" };
  if (score <= 60) return { label: "Fair", color: "bg-yellow-500" };
  if (score <= 80) return { label: "Good", color: "bg-green-500" };
  return { label: "Strong", color: "bg-primary" };
}

export function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const met = requirements.map((r) => r.test(password));
  const score = password.length === 0 ? 0 : met.filter(Boolean).length * 20;
  const info = getStrengthInfo(score);

  return (
    <div className="py-6 max-w-sm mx-auto space-y-4">
      {/* Input */}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-500"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={spring}
          onClick={() => setVisible((v) => !v)}
          className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-500"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${info.color} transition-all duration-500`}
            initial={{ width: "0%" }}
            animate={{ width: `${score}%` }}
            transition={spring}
          />
        </div>
        <AnimatePresence mode="wait">
          {password.length > 0 && (
            <motion.p
              key={info.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={spring}
              className="text-xs font-medium text-muted-foreground"
            >
              {info.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2 pt-1">
        {requirements.map((req, i) => {
          const passed = met[i];
          return (
            <div
              key={req.key}
              className="flex items-center gap-2 text-xs transition-all duration-500"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={passed ? "check" : "x"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={spring}
                  className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-500 ${
                    passed
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground/40"
                  }`}
                >
                  {passed ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <X className="w-2.5 h-2.5" />
                  )}
                </motion.span>
              </AnimatePresence>
              <span
                className={`transition-all duration-500 ${
                  passed ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
