"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputCls = "w-full h-[38px] rounded-[10px] border border-border bg-card px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-[3px] focus:ring-primary/8 transition-all duration-500";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <div>
      <Link href="/signin" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground cursor-pointer transition-all duration-500 mb-6">
        <ArrowLeft className="w-3 h-3" /> Back to sign in
      </Link>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -16 }} transition={spring}>
            <div className="mb-8">
              <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Reset password</h1>
              <p className="text-[13px] text-muted-foreground mt-1">We&apos;ll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-foreground/70">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>

              <motion.button type="submit" disabled={loading || !email}
                whileHover={loading ? {} : { y: -1 }} whileTap={loading ? {} : { scale: 0.985 }} transition={spring}
                className="w-full h-[38px] rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_0_hsl(164_70%_40%/0.25)]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="sent" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={spring}>
            <motion.div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4"
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: 0.1 }}>
              <Mail className="w-5 h-5 text-primary" />
            </motion.div>

            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Check your inbox</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Reset link sent to <span className="text-foreground font-medium">{email}</span>
            </p>

            <button onClick={() => setSent(false)} className="mt-4 text-[11px] text-muted-foreground/60 hover:text-muted-foreground cursor-pointer transition-all duration-500">
              Try a different email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
