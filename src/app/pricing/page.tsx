"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const freePlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  description: "Get started with the basics",
  features: [
    "5 problems per path",
    "3 AI reviews per day",
    "2 AI hints per day",
    "1 solution reveal per day",
    "Unlimited code execution",
    "MCQ unlimited",
  ],
};

const proPlan = {
  name: "Pro",
  priceMonthly: "$9",
  priceYearly: "$90",
  description: "Unlimited everything",
  features: [
    "All problems unlocked",
    "Unlimited AI reviews",
    "Unlimited AI hints",
    "Unlimited solution reveals",
    "AI-generated custom challenges",
    "Daily practice emails (5 problems/day)",
    "Full progress analytics",
    "Weak area detection",
    "Priority support",
  ],
};

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Simple, honest pricing</h1>
        <p className="text-[15px] text-muted-foreground">Start free. Go Pro when you're ready to level up.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">{freePlan.name}</h2>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold font-mono">{freePlan.price}</span>
            <span className="text-sm text-muted-foreground">{freePlan.period}</span>
          </div>
          <p className="text-[13px] text-muted-foreground mt-2 mb-6">{freePlan.description}</p>

          <Link href="/signup"
            className="block w-full text-center text-[13px] font-medium py-2.5 rounded-lg border border-border hover:bg-secondary cursor-pointer transition-all duration-500">
            Get Started
          </Link>

          <div className="mt-6 space-y-2">
            {freePlan.features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                <span className="text-[13px] text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.15 }}
          className="rounded-xl border-2 border-primary/40 bg-primary/[0.02] p-6 relative"
        >
          <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Recommended
          </span>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-[13px] font-semibold text-primary uppercase tracking-wide">{proPlan.name}</h2>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono">{proPlan.priceMonthly}</span>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1">
            or {proPlan.priceYearly}/year — save $18
          </p>
          <p className="text-[13px] text-muted-foreground mt-2 mb-6">{proPlan.description}</p>

          <Link href="/signup"
            className="block w-full text-center text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 py-2.5 rounded-lg cursor-pointer transition-all duration-500">
            <Zap className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Upgrade to Pro
          </Link>

          <div className="mt-6 space-y-2">
            {proPlan.features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-[13px] text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQ-like section */}
      <div className="max-w-2xl mx-auto mt-16 space-y-6">
        <h2 className="text-lg font-semibold text-center">Frequently asked</h2>
        <div className="space-y-4">
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings. You keep Pro access until the end of your billing period." },
            { q: "Is there a refund policy?", a: "Yes — 14-day money-back guarantee, no questions asked. See our refund policy for details." },
            { q: "What payment methods do you accept?", a: "We accept credit/debit cards, PayPal, and other methods through Paddle, our payment processor." },
            { q: "Do you offer team plans?", a: "Not yet, but it's on our roadmap. Contact us if you're interested in team pricing." },
          ].map((item) => (
            <div key={item.q} className="rounded-lg border border-border p-4">
              <p className="text-[13px] font-medium text-foreground">{item.q}</p>
              <p className="text-[12px] text-muted-foreground mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-center gap-4 mt-12 text-[11px] text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-foreground cursor-pointer transition-colors">Terms</Link>
        <span>·</span>
        <Link href="/refund" className="hover:text-foreground cursor-pointer transition-colors">Refund Policy</Link>
      </div>
    </main>
  );
}
