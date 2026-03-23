"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

const springHover = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputClass =
  "w-full h-11 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-500";

const requirements = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string) {
  const passed = requirements.filter((r) => r.test(password)).length;
  return (passed / requirements.length) * 100;
}

function getStrengthColor(s: number) {
  if (s <= 20) return "bg-destructive";
  if (s <= 40) return "bg-orange-500";
  if (s <= 60) return "bg-amber-500";
  if (s <= 80) return "bg-emerald-500";
  return "bg-primary";
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || strength < 60) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push(`/verify?email=${encodeURIComponent(email)}`);
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
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your coding journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[13px] font-medium text-foreground">Full name</label>
            <motion.input
              id="name" type="text" placeholder="Your full name" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass}
              whileFocus={{ scale: 1.01 }} transition={springHover} required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</label>
            <motion.input
              id="email" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className={inputClass}
              whileFocus={{ scale: 1.01 }} transition={springHover} required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</label>
            <div className="relative">
              <motion.input
                id="password" type={showPassword ? "text" : "password"} placeholder="Create a password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`} whileFocus={{ scale: 1.01 }}
                transition={springHover} required
              />
              <motion.button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                whileTap={{ scale: 0.85 }} transition={springHover}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={showPassword ? "off" : "on"}
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }} transition={springHover}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Strength meter */}
            <AnimatePresence>
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="space-y-2.5 pt-2 overflow-hidden"
                >
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getStrengthColor(strength)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${strength}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {requirements.map((req) => {
                      const met = req.test(password);
                      return (
                        <div key={req.label} className="flex items-center gap-1.5">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={met ? "check" : "x"}
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 90 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              {met ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <X className="h-3 w-3 text-muted-foreground/40" />
                              )}
                            </motion.div>
                          </AnimatePresence>
                          <span className={`text-[11px] transition-all duration-500 ${met ? "text-foreground" : "text-muted-foreground/50"}`}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit" disabled={loading || strength < 60}
            whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.98 }}
            transition={springHover}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </motion.button>
        </form>

        <p className="text-[13px] text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary font-medium hover:underline underline-offset-4 cursor-pointer transition-all duration-500">
            Sign in
          </Link>
        </p>

        <p className="text-[11px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
          By creating an account, you agree to our{" "}
          <span className="text-foreground/60 hover:underline cursor-pointer underline-offset-2 transition-all duration-500">Terms</span>
          {" "}and{" "}
          <span className="text-foreground/60 hover:underline cursor-pointer underline-offset-2 transition-all duration-500">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
