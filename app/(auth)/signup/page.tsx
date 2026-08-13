"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { SignupSteps } from "@/components/auth/signup-steps";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Input } from "@/components/ui/input";
import { PasswordStrength, passwordScore } from "@/components/auth/password-strength";
import { signup as apiSignup, getErrorMessage } from "@/lib/api/auth";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const score = passwordScore(pw);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || score < 60) return;
    setLoading(true);
    try {
      await apiSignup(email, name, pw);
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SignupSteps current={0} />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-text">
          Create your account
        </h1>
        <p className="text-[13px] text-brand-text-muted mt-1">
          14-day Premium trial, free. No credit card required.
        </p>
      </div>

      <SocialButtons action="Sign up" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-brand-border" />
        <span className="text-[11px] text-brand-text-subtle">or</span>
        <div className="flex-1 h-px bg-brand-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-brand-text-muted">Name</label>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-brand-text-muted">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-brand-text-muted">Password</label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Create a password"
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

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-brand-destructive font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading || score < 60}
          whileHover={loading ? {} : { y: -1 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          transition={SPRING}
          className="w-full h-10 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
        >
          {loading ? <Spinner /> : "Create account"}
        </motion.button>
      </form>

      <p className="text-[12px] text-brand-text-muted mt-8 text-center">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-brand-text font-medium cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary focus-visible:text-brand-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
