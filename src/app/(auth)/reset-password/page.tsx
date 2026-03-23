"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ArrowLeft, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

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
  return (requirements.filter((r) => r.test(password)).length / requirements.length) * 100;
}

function getStrengthColor(s: number) {
  if (s <= 20) return "bg-destructive";
  if (s <= 40) return "bg-orange-500";
  if (s <= 60) return "bg-amber-500";
  if (s <= 80) return "bg-emerald-500";
  return "bg-primary";
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = passwordsMatch && strength >= 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
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
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="form" exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div whileHover={{ x: -2 }} transition={springHover} className="w-fit mb-5">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Link>
              </motion.div>

              <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Set new password</h1>
                <p className="text-sm text-muted-foreground mt-1">Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[13px] font-medium text-foreground">New password</label>
                  <div className="relative">
                    <motion.input
                      id="password" type={showPassword ? "text" : "password"} placeholder="Enter new password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-10`} whileFocus={{ scale: 1.01 }}
                      transition={springHover} required
                    />
                    <motion.button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                      whileTap={{ scale: 0.85 }} transition={springHover}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="space-y-2.5 pt-2 overflow-hidden"
                      >
                        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${getStrengthColor(strength)}`}
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
                                    {met ? <Check className="h-3 w-3 text-primary" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
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

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="text-[13px] font-medium text-foreground">Confirm password</label>
                  <div className="relative">
                    <motion.input
                      id="confirm" type={showConfirm ? "text" : "password"} placeholder="Confirm new password"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputClass} pr-10`} whileFocus={{ scale: 1.01 }}
                      transition={springHover} required
                    />
                    <motion.button
                      type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                      whileTap={{ scale: 0.85 }} transition={springHover}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} className="text-[11px] text-destructive mt-1"
                      >
                        Passwords don&apos;t match
                      </motion.p>
                    )}
                    {passwordsMatch && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} className="text-[11px] text-primary mt-1 flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Passwords match
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit" disabled={loading || !canSubmit}
                  whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.98 }}
                  transition={springHover}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="done" initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center py-4"
            >
              <motion.svg
                className="h-14 w-14 mx-auto mb-4 text-primary"
                viewBox="0 0 52 52" fill="none"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                <motion.path
                  d="M15 27 L22 34 L37 19"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                />
              </motion.svg>

              <h1 className="text-xl font-semibold tracking-tight text-foreground">Password reset!</h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Your password has been successfully updated.
              </p>

              <Link href="/signin" className="block mt-6">
                <motion.div
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springHover}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all duration-500 flex items-center justify-center"
                >
                  Back to sign in
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
