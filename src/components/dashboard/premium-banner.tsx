"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Code2, Database, Layout, Webhook } from "lucide-react";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const paths = [
  { icon: Code2, label: "Python" },
  { icon: Database, label: "Django" },
  { icon: Layout, label: "Django Fundamentals" },
  { icon: Webhook, label: "REST Framework" },
];

export function PremiumBanner() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="relative rounded-xl border border-primary/20 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/30" />
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />

        <div className="relative p-5 flex flex-col h-full">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/15">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-wide uppercase">Pro</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/15 to-transparent" />
          </div>

          {/* Copy */}
          <h3 className="text-[15px] font-bold text-foreground leading-snug tracking-tight">
            Stop practicing in circles.
            <br />
            <span className="text-primary">Build real skills.</span>
          </h3>

          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            Unlimited AI-generated challenges, full access to every path, and reviews that teach you why — not just what.
          </p>

          {/* Paths preview */}
          <div className="flex items-center gap-2 mt-4">
            {paths.map((p) => (
              <div key={p.label} className="w-7 h-7 rounded-lg bg-card/80 border border-border/40 flex items-center justify-center" title={p.label}>
                <p.icon className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
            <span className="text-[10px] text-muted-foreground/50 ml-1">4 paths included</span>
          </div>

          <div className="flex-1" />

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
            onClick={() => setShowUpgrade(true)}
            className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 cursor-pointer transition-colors duration-100 group/btn"
          >
            See what you get
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
          </motion.button>

          <p className="text-[9px] text-muted-foreground/40 text-center mt-2">
            $9/mo &middot; Cancel anytime
          </p>
        </div>
      </motion.div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
