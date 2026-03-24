"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { SignupSteps } from "@/components/auth/signup-steps";
import { SocialButtons } from "@/components/auth/social-buttons";
import { signup as apiSignup } from "@/lib/api/auth";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputCls = "w-full h-[38px] rounded-[10px] border border-border bg-card px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-[3px] focus:ring-primary/8 transition-all duration-500";

const rules = [
  { key: "len", label: "8+ chars", test: (p: string) => p.length >= 8 },
  { key: "up", label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { key: "low", label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { key: "num", label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { key: "spc", label: "Special", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function strengthColor(score: number) {
  if (score <= 20) return "bg-red-500";
  if (score <= 40) return "bg-orange-500";
  if (score <= 60) return "bg-yellow-500";
  if (score <= 80) return "bg-green-500";
  return "bg-primary";
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const met = rules.map((r) => r.test(pw));
  const score = pw.length === 0 ? 0 : met.filter(Boolean).length * 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || score < 60) return;
    setLoading(true);
    try {
      await apiSignup(email, name, pw);
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SignupSteps current={0} />

      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Create your account</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Start mastering the craft</p>
      </div>

      <SocialButtons action="Sign up" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[11px] text-muted-foreground/40">or</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground/70">Name</label>
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground/70">Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground/70">Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="Create a password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${inputCls} pr-10`} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-pointer transition-all duration-500">
              {showPw ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
            </button>
          </div>

          {/* Strength */}
          <AnimatePresence>
            {pw.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-2 space-y-2">
                  <div className="h-[3px] rounded-full bg-border/40 overflow-hidden">
                    <motion.div className={`h-full rounded-full ${strengthColor(score)}`} animate={{ width: `${score}%` }} transition={spring} />
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {rules.map((r, i) => (
                      <div key={r.key} className="flex items-center gap-1">
                        <motion.span
                          animate={{ scale: met[i] ? 1 : 0.8, opacity: met[i] ? 1 : 0.3 }}
                          transition={spring}
                          className={`w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-500 ${met[i] ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                        >
                          {met[i] ? <Check className="w-[8px] h-[8px]" /> : <X className="w-[8px] h-[8px]" />}
                        </motion.span>
                        <span className={`text-[10px] transition-all duration-500 ${met[i] ? "text-foreground/70" : "text-muted-foreground/30"}`}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] text-destructive font-medium">{error}</motion.p>
          )}
        </AnimatePresence>

        <motion.button type="submit" disabled={loading || score < 60}
          whileHover={loading ? {} : { y: -1 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          transition={spring}
          className="w-full h-[38px] rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_0_hsl(164_70%_40%/0.25)]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
        </motion.button>
      </form>

      <p className="text-[12px] text-muted-foreground mt-8 text-center">
        Already have an account?{" "}
        <Link href="/signin" className="text-foreground font-medium hover:text-primary cursor-pointer transition-all duration-500">Sign in</Link>
      </p>
    </div>
  );
}
