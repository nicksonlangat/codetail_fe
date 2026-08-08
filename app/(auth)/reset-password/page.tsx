"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/auth/otp-input";
import { PasswordStrength, passwordScore } from "@/components/auth/password-strength";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const RESEND_SECONDS = 30;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = passwordScore(pw);
  const match = pw.length > 0 && pw === confirm;

  useEffect(() => {
    if (step !== 0 || cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, cooldown]);

  function handleVerifyCode(fullCode?: string) {
    const value = fullCode ?? code.join("");
    if (value.length < 6) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    setOtpError("");
    setStep(1);
  }

  function handleResend() {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
  }

  function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!match || score < 60) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={SPRING}
          >
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1 text-[11px] text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-text-muted focus-visible:text-brand-primary mb-6"
            >
              <ArrowLeft className="size-3" /> Back
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-brand-text">
                Enter your code
              </h1>
              <p className="text-[13px] text-brand-text-muted mt-1">
                We sent a 6-digit code to{" "}
                {email ? (
                  <span className="text-brand-text font-medium">{email}</span>
                ) : (
                  "your email"
                )}
              </p>
            </div>

            <OtpInput value={code} onChange={setCode} onComplete={handleVerifyCode} />

            <AnimatePresence>
              {otpError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-brand-destructive font-medium mt-3"
                >
                  {otpError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => handleVerifyCode()}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={SPRING}
              className="w-full h-10 mt-6 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
            >
              Continue
            </motion.button>

            <p className="text-[12px] text-brand-text-muted mt-8 text-center">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-brand-text font-medium cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary focus-visible:text-brand-primary disabled:text-brand-text-subtle disabled:cursor-default"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={SPRING}
          >
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-1 text-[11px] text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-text-muted focus-visible:text-brand-primary mb-6"
            >
              <ArrowLeft className="size-3" /> Back
            </button>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-brand-text">
                New password
              </h1>
              <p className="text-[13px] text-brand-text-muted mt-1">Choose something strong</p>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-brand-text-muted">Password</label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="New password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-text-muted focus-visible:text-brand-primary"
                  >
                    {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                <PasswordStrength password={pw} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-brand-text-muted">Confirm</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-text-muted focus-visible:text-brand-primary"
                  >
                    {showConfirm ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                {confirm.length > 0 && !match && (
                  <p className="text-[10px] text-brand-destructive">Doesn&apos;t match</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading || !match || score < 60}
                whileHover={loading ? {} : { y: -1 }}
                whileTap={loading ? {} : { scale: 0.985 }}
                transition={SPRING}
                className="w-full h-10 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
              >
                {loading ? <Spinner /> : "Reset password"}
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={SPRING}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="size-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4"
            >
              <Check className="size-5 text-brand-primary" />
            </motion.div>

            <h1 className="text-2xl font-semibold tracking-tight text-brand-text">
              Password updated
            </h1>
            <p className="text-[13px] text-brand-text-muted mt-1">
              You can now sign in with your new password
            </p>

            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 mt-4 text-[12px] text-brand-primary font-medium cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover focus-visible:text-brand-primary-hover"
            >
              Sign in <ArrowRight className="size-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
