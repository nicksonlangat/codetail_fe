"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ArrowLeft, Loader2, Mail } from "lucide-react";

const springHover = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputClass =
  "w-full h-11 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-500";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail("");
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
        <motion.div whileHover={{ x: -2 }} transition={springHover} className="w-fit mb-5">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Reset your password</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                    Email address
                  </label>
                  <motion.input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    whileFocus={{ scale: 1.01 }}
                    transition={springHover}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  transition={springHover}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center"
            >
              <motion.div
                className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <Mail className="h-7 w-7 text-primary" />
              </motion.div>

              <h1 className="text-xl font-semibold tracking-tight text-foreground">Check your email</h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                We sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>

              <div className="mt-6 space-y-3">
                <Link href="/reset-password">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springHover}
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all duration-500 flex items-center justify-center"
                  >
                    Continue to reset
                  </motion.div>
                </Link>

                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springHover}
                  className="w-full h-11 rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
                >
                  Try a different email
                </motion.button>

                <p className="text-[11px] text-muted-foreground/60">
                  Didn&apos;t receive it? Check your spam folder.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
