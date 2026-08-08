"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }, 800);
  }

  return (
    <div>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 text-[11px] text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:text-brand-text-muted focus-visible:text-brand-primary mb-6"
      >
        <ArrowLeft className="size-3" /> Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-text">Reset password</h1>
        <p className="text-[13px] text-brand-text-muted mt-1">
          We&apos;ll send you a 6-digit code
        </p>
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

        <motion.button
          type="submit"
          disabled={loading || !email}
          whileHover={loading ? {} : { y: -1 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          transition={SPRING}
          className="w-full h-10 rounded-lg border border-transparent bg-brand-primary text-white text-[13px] font-medium cursor-pointer outline-none transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default hover:bg-brand-primary-hover focus-visible:border-white/50 shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Send code"}
        </motion.button>
      </form>
    </div>
  );
}
