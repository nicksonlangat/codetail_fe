"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Loader2, CheckCircle2 } from "lucide-react";

const springHover = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const verify = useCallback(async (code: string[]) => {
    const full = code.join("");
    if (full.length !== 6) return;
    setVerifying(true);
    setError(false);
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError(false);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) verify(next);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (next.every((d) => d !== "")) verify(next);
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp(Array(6).fill(""));
    setError(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-[400px] px-6">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <motion.div
          className="w-9 h-9 rounded-[11px] bg-primary flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Code2 className="w-5 h-5 text-primary-foreground" />
        </motion.div>
        <span className="text-[18px] font-semibold tracking-tight text-foreground">codetail</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-elevated">
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success" initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Verified!</h1>
                <p className="text-sm text-muted-foreground mt-1">Redirecting to dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="verify" exit={{ opacity: 0 }}>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Verify your email</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="text-foreground font-medium">{email}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!success && (
          <>
            {/* OTP inputs */}
            <motion.div
              className="flex justify-center gap-2.5 mb-6"
              animate={error ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.5 }}
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={verifying}
                  whileFocus={{ scale: 1.05 }}
                  transition={springHover}
                  className={`w-11 h-13 rounded-lg border text-center text-lg font-semibold bg-background transition-all duration-500 focus:outline-none focus:ring-2 cursor-pointer ${
                    success
                      ? "border-primary text-primary focus:ring-primary/20"
                      : error
                        ? "border-destructive text-destructive focus:ring-destructive/20"
                        : "border-border text-foreground focus:ring-primary/20 focus:border-primary"
                  } disabled:opacity-50`}
                />
              ))}
            </motion.div>

            {verifying && (
              <div className="flex justify-center mb-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            <div className="text-center space-y-3">
              <div>
                {canResend ? (
                  <motion.button
                    onClick={handleResend}
                    className="text-[13px] text-primary font-medium hover:underline underline-offset-4 cursor-pointer transition-all duration-500"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    transition={springHover}
                  >
                    Resend code
                  </motion.button>
                ) : (
                  <p className="text-[13px] text-muted-foreground">
                    Resend code in <span className="font-mono tabular-nums text-foreground">{countdown}s</span>
                  </p>
                )}
              </div>
              <Link
                href="/signup"
                className="text-[13px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500 inline-block"
              >
                Use a different email
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
