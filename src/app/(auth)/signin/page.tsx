"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SocialButtons } from "@/components/auth/social-buttons";
import { login as apiLogin, getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputCls = "w-full h-[38px] rounded-[10px] border border-border bg-card px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-[3px] focus:ring-primary/8 transition-all duration-500";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !pw) {
      setError("All fields are required");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    try {
      const tokens = await apiLogin(email, pw);
      useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
      const user = await getMe();
      useAuthStore.getState().login(user, tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 403) {
        setError(detail || "Please verify your email first");
      } else {
        setError(detail || "Invalid email or password");
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      animate={shake ? { x: [0, -5, 5, -3, 3, 0] } : {}}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Welcome back</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Sign in to continue practicing</p>
      </div>

      <SocialButtons action="Sign in" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[11px] text-muted-foreground/40">or</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground/70">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-foreground/70">Password</label>
            <Link href="/forgot-password"
              className="text-[11px] text-muted-foreground hover:text-primary cursor-pointer transition-all duration-500">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
              className={`${inputCls} pr-10`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-pointer transition-all duration-500">
              {showPw ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] text-destructive font-medium">{error}</motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { y: -1 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          transition={spring}
          className="w-full h-[38px] rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_0_hsl(164_70%_40%/0.25)]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
        </motion.button>
      </form>

      <p className="text-[12px] text-muted-foreground mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:text-primary cursor-pointer transition-all duration-500">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
