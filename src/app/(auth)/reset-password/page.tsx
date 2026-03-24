"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const inputCls = "w-full h-[38px] rounded-[10px] border border-border bg-card px-3 pr-10 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-[3px] focus:ring-primary/8 transition-all duration-500";

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

export default function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const met = rules.map((r) => r.test(pw));
  const score = pw.length === 0 ? 0 : met.filter(Boolean).length * 20;
  const match = pw.length > 0 && pw === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match || score < 60) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -16 }} transition={spring}>
            <Link href="/forgot-password" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground cursor-pointer transition-all duration-500 mb-6">
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>

            <div className="mb-8">
              <h1 className="text-[22px] font-semibold tracking-tight leading-tight">New password</h1>
              <p className="text-[13px] text-muted-foreground mt-1">Choose something strong</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-foreground/70">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-pointer transition-all duration-500">
                    {showPw ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
                  </button>
                </div>

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
                              <motion.span animate={{ scale: met[i] ? 1 : 0.8, opacity: met[i] ? 1 : 0.3 }} transition={spring}
                                className={`w-[14px] h-[14px] rounded-full flex items-center justify-center ${met[i] ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                                {met[i] ? <Check className="w-[8px] h-[8px]" /> : <X className="w-[8px] h-[8px]" />}
                              </motion.span>
                              <span className={`text-[10px] ${met[i] ? "text-foreground/70" : "text-muted-foreground/30"}`}>{r.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-foreground/70">Confirm</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-pointer transition-all duration-500">
                    {showConfirm ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
                  </button>
                </div>
                {confirm.length > 0 && !match && (
                  <p className="text-[10px] text-destructive">Doesn&apos;t match</p>
                )}
              </div>

              <motion.button type="submit" disabled={loading || !match || score < 60}
                whileHover={loading ? {} : { y: -1 }} whileTap={loading ? {} : { scale: 0.985 }} transition={spring}
                className="w-full h-[38px] rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium cursor-pointer transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_0_hsl(164_70%_40%/0.25)]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset password"}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={spring}>
            <motion.div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4"
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ ...spring, delay: 0.1 }}>
              <Check className="w-5 h-5 text-primary" />
            </motion.div>

            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">Password updated</h1>
            <p className="text-[13px] text-muted-foreground mt-1">You can now sign in with your new password</p>

            <Link href="/signin" className="inline-flex items-center gap-1.5 mt-4 text-[12px] text-primary font-medium hover:text-primary/80 cursor-pointer transition-all duration-500">
              Sign in <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
