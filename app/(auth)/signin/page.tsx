"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Input } from "@/components/ui/input";
import { login as apiLogin, getMe, getErrorMessage } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !pw) {
      setError("All fields are required");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const tokens = await apiLogin(email, pw);
      useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
      const user = await getMe();
      useAuthStore.getState().login(user, tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 403) {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(getErrorMessage(err, "Invalid email or password"));
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-text">Welcome back</h1>
        <p className="text-[13px] text-brand-text-muted mt-1">Sign in to continue practicing</p>
      </div>

      <SocialButtons action="Sign in" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-brand-border" />
        <span className="text-[11px] text-brand-text-subtle">or</span>
        <div className="flex-1 h-px bg-brand-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-brand-text-muted">Password</label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary focus-visible:text-brand-primary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Enter password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
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
          disabled={loading}
          whileHover={loading ? {} : { y: -1 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          transition={SPRING}
          className="w-full h-10 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
        >
          {loading ? <Spinner /> : "Continue"}
        </motion.button>
      </form>

      <p className="text-[12px] text-brand-text-muted mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-brand-text font-medium cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary focus-visible:text-brand-primary"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
