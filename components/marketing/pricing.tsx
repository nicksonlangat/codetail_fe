"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, WandSparkles, Rocket } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

const FREE_FEATURES = [
  "5 problems per path",
  "3 AI reviews per day",
  "2 AI hints per day",
  "1 solution reveal per day",
  "Unlimited code execution",
  "Unlimited MCQs",
];

const PRO_FEATURES = [
  "All problems unlocked",
  "Unlimited AI reviews",
  "Unlimited AI hints",
  "Unlimited solution reveals",
  "AI-generated custom challenges",
  "Daily practice emails",
  "Full progress analytics",
  "Priority support",
];

const PREMIUM_FEATURES = [
  "Everything in Pro",
  "AI resume builder",
  "PDF export (10 templates)",
  "GitHub project import",
  "Resume ATS analysis",
  "Priority support",
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 pb-32 scroll-mt-24">
      <div className="max-w-xl mx-auto text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-2">
          Pricing
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-text">
          Simple, honest pricing
        </h2>
        <p className="mt-3 text-[13px] text-brand-text-muted">
          Start free. Premium trial included. No credit card required.
        </p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-brand-border p-1">
          {(["monthly", "yearly"] as const).map((opt) => {
            const active = (opt === "yearly") === yearly;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setYearly(opt === "yearly")}
                className="relative px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all duration-500"
              >
                {active && (
                  <motion.span
                    layoutId="billing-toggle"
                    transition={SPRING}
                    className="absolute inset-0 rounded-md bg-brand-primary"
                  />
                )}
                <span className={`relative z-10 ${active ? "text-white" : "text-brand-text-muted"}`}>
                  {opt === "monthly" ? "Monthly" : "Yearly"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={ENTRANCE}
          className="rounded-xl border border-brand-border p-6"
        >
          <h3 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">
            Free
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold font-mono text-brand-text">$0</span>
            <span className="text-sm text-brand-text-muted">forever</span>
          </div>
          <p className="text-[13px] text-brand-text-muted mt-2 mb-6">
            Get started with the basics
          </p>

          <Link
            href="/signup"
            className="block w-full text-center text-[13px] font-medium py-2.5 rounded-lg border border-brand-border text-brand-text cursor-pointer transition-all duration-500 hover:bg-brand-surface"
          >
            Get started
          </Link>

          <div className="mt-6 space-y-2">
            {FREE_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-brand-text-subtle shrink-0 mt-0.5" />
                <span className="text-[13px] text-brand-text-muted">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...ENTRANCE, delay: 0.08 }}
          className="relative rounded-xl border-2 border-brand-primary/40 bg-brand-primary/5 p-6"
        >
          <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
            Most Popular
          </span>

          <div className="flex items-center gap-2">
            <WandSparkles className="size-4 text-brand-primary" />
            <h3 className="text-xs font-semibold text-brand-primary uppercase tracking-wide">
              Pro
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-brand-text">
              ${yearly ? "7.50" : "9"}
            </span>
            <span className="text-sm text-brand-text-muted">/ month</span>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-1">
            {yearly ? "billed $90/year, save $18" : "or $90/year, save $18"}
          </p>
          <p className="text-[13px] text-brand-text-muted mt-2 mb-6">Unlimited everything</p>

          <Link
            href="/signup"
            className="flex items-center justify-center gap-1.5 w-full text-center text-[13px] font-semibold text-white bg-brand-primary py-2.5 rounded-lg cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover"
          >
            <Zap className="size-3.5" />
            Upgrade to Pro
          </Link>

          <div className="mt-6 space-y-2">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span className="text-[13px] text-brand-text">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...ENTRANCE, delay: 0.16 }}
          className="relative rounded-xl border border-brand-border bg-gradient-to-b from-brand-surface to-transparent p-6"
        >
          <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
            14-day free trial
          </span>

          <div className="flex items-center gap-2">
            <Rocket className="size-4 text-brand-text" />
            <h3 className="text-xs font-semibold text-brand-text uppercase tracking-wide">
              Premium
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-brand-text">
              ${yearly ? "15.83" : "19"}
            </span>
            <span className="text-sm text-brand-text-muted">/ month</span>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-1">
            {yearly ? "billed $190/year, save $38" : "or $190/year, save $38"}
          </p>
          <p className="text-[13px] text-brand-text-muted mt-2 mb-6">
            Pro plus career tools
          </p>

          <Link
            href="/signup"
            className="flex items-center justify-center gap-1.5 w-full text-center text-[13px] font-semibold text-brand-text border border-brand-border py-2.5 rounded-lg cursor-pointer transition-all duration-500 hover:bg-brand-surface"
          >
            <Rocket className="size-3.5" />
            Try Premium free
          </Link>

          <p className="text-[11px] text-brand-text-subtle text-center mt-2">
            No credit card required
          </p>

          <div className="mt-4 space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-brand-text-subtle shrink-0 mt-0.5" />
                <span className="text-[13px] text-brand-text-muted">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
