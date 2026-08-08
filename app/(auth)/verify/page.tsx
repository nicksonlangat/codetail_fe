"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { SignupSteps } from "@/components/auth/signup-steps";
import { OtpInput } from "@/components/auth/otp-input";
import { verifyOtp, resendOtp, getMe, getErrorMessage } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const RESEND_SECONDS = 30;

function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleVerify(fullCode?: string) {
    const value = fullCode ?? code.join("");
    if (value.length < 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const tokens = await verifyOtp(email, value);
      useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
      const user = await getMe();
      useAuthStore.getState().login(user, tokens.access_token, tokens.refresh_token);
      router.push("/onboarding");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired code"));
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
    try {
      await resendOtp(email);
    } catch {
      // resend failures aren't shown inline; the cooldown reset is enough feedback
    }
  }

  return (
    <div>
      <SignupSteps current={1} />

      <div className="flex items-center gap-3 mb-2">
        <span className="size-9 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
          <Mail className="size-4 text-brand-primary" />
        </span>
        <h1 className="text-xl font-semibold tracking-tight text-brand-text">
          Verify your email
        </h1>
      </div>
      <p className="text-[13px] text-brand-text-muted mb-8">
        We sent a 6-digit code to{" "}
        {email ? <span className="text-brand-text font-medium">{email}</span> : "your email"}.
      </p>

      <OtpInput value={code} onChange={setCode} onComplete={handleVerify} />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-brand-destructive font-medium mt-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => handleVerify()}
        disabled={loading}
        whileHover={loading ? {} : { y: -1 }}
        whileTap={loading ? {} : { scale: 0.985 }}
        transition={SPRING}
        className="w-full h-10 mt-6 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify email"}
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
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
