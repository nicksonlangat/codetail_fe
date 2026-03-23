"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };
const CORRECT_CODE = "123456";

type Status = "idle" | "verifying" | "success" | "error";

export function OtpInput() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // Auto-verify when all digits filled
  useEffect(() => {
    if (digits.every((d) => d !== "") && status === "idle") {
      setStatus("verifying");
      const timer = setTimeout(() => {
        const code = digits.join("");
        setStatus(code === CORRECT_CODE ? "success" : "error");
        if (code !== CORRECT_CODE) {
          setTimeout(() => setStatus("idle"), 1200);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [digits, status]);

  const updateDigit = useCallback(
    (index: number, value: string) => {
      if (status !== "idle") return;
      const next = [...digits];
      next[index] = value;
      setDigits(next);
    },
    [digits, status]
  );

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    updateDigit(index, char);
    if (char && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (digits[index] === "" && index > 0) {
        refs.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      } else {
        updateDigit(index, "");
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = text[i] || "";
    }
    setDigits(next);
    const focusIdx = Math.min(text.length, 5);
    refs.current[focusIdx]?.focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setDigits(Array(6).fill(""));
    setStatus("idle");
    setCountdown(30);
    refs.current[0]?.focus();
  };

  const borderColor = (i: number) => {
    if (status === "success") return "border-green-500 ring-1 ring-green-500/20";
    if (status === "error") return "border-red-500 ring-1 ring-red-500/20";
    return "border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20";
  };

  return (
    <div className="py-6 flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-1">Enter verification code</p>
      <p className="text-[11px] text-muted-foreground/60 mb-6">
        Hint: try <span className="font-mono">123456</span>
      </p>

      {/* Digit inputs */}
      <div className="flex gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <motion.div
            key={i}
            animate={
              status === "error"
                ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                : status === "success"
                  ? { scale: [1, 1.05, 1] }
                  : {}
            }
            transition={
              status === "error"
                ? { duration: 0.5, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          >
            <motion.input
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              whileFocus={{ scale: 1.05 }}
              transition={spring}
              className={`w-12 h-14 text-center text-xl font-mono rounded-lg border bg-background text-foreground outline-none cursor-pointer transition-all duration-500 ${borderColor(i)}`}
              disabled={status === "verifying" || status === "success"}
            />
          </motion.div>
        ))}
      </div>

      {/* Status feedback */}
      <div className="h-8 mt-4 flex items-center">
        {status === "verifying" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Verifying…</span>
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            className="flex items-center gap-1.5 text-green-500"
          >
            <Check className="w-4 h-4" />
            <span className="text-xs font-medium">Verified successfully</span>
          </motion.div>
        )}
        {status === "error" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500"
          >
            Invalid code. Please try again.
          </motion.span>
        )}
      </div>

      {/* Resend link */}
      <button
        onClick={handleResend}
        disabled={countdown > 0}
        className={`mt-2 text-xs cursor-pointer transition-all duration-500 ${
          countdown > 0
            ? "text-muted-foreground/40"
            : "text-primary hover:text-primary/80"
        }`}
      >
        {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
      </button>
    </div>
  );
}
