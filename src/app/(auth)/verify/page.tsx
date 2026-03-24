"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { SignupSteps } from "@/components/auth/signup-steps";
import { verifyOtp, resendOtp as apiResend, getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
type Status = "idle" | "verifying" | "success" | "error";

export default function VerifyPage() {
  return <Suspense><VerifyContent /></Suspense>;
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (digits.every((d) => d !== "") && status === "idle") {
      setStatus("verifying");
      (async () => {
        try {
          const code = digits.join("");
          const tokens = await verifyOtp(email, code);
          useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
          const user = await getMe();
          useAuthStore.getState().login(user, tokens.access_token, tokens.refresh_token);
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 1200);
        } catch {
          setStatus("error");
          setTimeout(() => {
            setDigits(Array(6).fill(""));
            setStatus("idle");
            refs.current[0]?.focus();
          }, 1500);
        }
      })();
    }
  }, [digits, status, router, email]);

  const updateDigit = useCallback((i: number, v: string) => {
    if (status !== "idle") return;
    setDigits((prev) => { const n = [...prev]; n[i] = v; return n; });
  }, [status]);

  const handleChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    updateDigit(i, ch);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (digits[i] === "" && i > 0) { refs.current[i - 1]?.focus(); updateDigit(i - 1, ""); }
      else updateDigit(i, "");
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setDigits((prev) => { const n = [...prev]; for (let i = 0; i < 6; i++) n[i] = text[i] || ""; return n; });
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await apiResend(email);
    } catch {}
    setDigits(Array(6).fill(""));
    setStatus("idle");
    setCountdown(60);
    refs.current[0]?.focus();
  };

  const ring = status === "success" ? "border-green-500/60 ring-[3px] ring-green-500/10"
    : status === "error" ? "border-red-500/60 ring-[3px] ring-red-500/10"
    : "border-border/80 focus:border-primary/60 focus:ring-[3px] focus:ring-primary/8";

  return (
    <div>
      <SignupSteps current={status === "success" ? 2 : 1} />

      <Link href="/signup" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground cursor-pointer transition-all duration-500 mb-6">
        <ArrowLeft className="w-3 h-3" /> Back
      </Link>

      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Check your email</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          We sent a code to <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <div className="flex gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={status === "verifying" || status === "success"}
            animate={status === "error" ? { x: [0, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`w-11 h-[46px] text-center text-[18px] font-mono rounded-[10px] border border-border bg-card text-foreground outline-none cursor-pointer transition-all duration-500 ${ring}`}
          />
        ))}
      </div>

      <div className="h-6 mt-4 flex items-center">
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-[1.5px] border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] text-muted-foreground">Verifying...</span>
            </motion.div>
          )}
          {status === "success" && (
            <motion.div key="s" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-green-500" />
              </div>
              <span className="text-[11px] text-green-600 font-medium">Verified — redirecting</span>
            </motion.div>
          )}
          {status === "error" && (
            <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-destructive">Invalid code — try again</motion.span>
          )}
        </AnimatePresence>
      </div>

      <button onClick={handleResend} disabled={countdown > 0}
        className={`mt-4 text-[11px] cursor-pointer transition-all duration-500 ${countdown > 0 ? "text-muted-foreground/25" : "text-muted-foreground/60 hover:text-primary"}`}>
        {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
      </button>
    </div>
  );
}
