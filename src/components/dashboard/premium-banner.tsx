"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight, Zap, Brain, Layers } from "lucide-react";

const features = [
  { icon: Brain, label: "Advanced AI Models" },
  { icon: Layers, label: "50+ Premium Paths" },
  { icon: Zap, label: "Unlimited Sessions" },
];

export function PremiumBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="relative rounded-xl border border-primary/20 overflow-hidden group"
    >
      {/* Gradient background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/30" />
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative p-5 flex flex-col h-full">
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/15">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary tracking-wide uppercase">
              Pro
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/15 to-transparent" />
        </div>

        {/* Headline */}
        <h3 className="text-[15px] font-bold text-foreground leading-snug tracking-tight">
          Unlock every path.
          <br />
          <span className="text-primary">Master every framework.</span>
        </h3>

        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed max-w-[240px]">
          Get access to advanced challenges, premium AI models, and structured
          paths from Django to system design.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/80 border border-border/60 backdrop-blur-sm"
            >
              <f.icon className="w-3 h-3 text-primary/70" />
              <span className="text-[10px] font-medium text-foreground/80">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Locked paths preview */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center"
            >
              <Lock className="w-3 h-3 text-muted-foreground/40" />
            </div>
          ))}
          <span className="text-[10px] text-muted-foreground/40 ml-0.5">
            +12 paths
          </span>
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <button className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold shadow-sm hover:bg-primary/90 transition-all duration-100 group/btn">
          Upgrade to Pro
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
        </button>

        <p className="text-[9px] text-muted-foreground/40 text-center mt-2">
          Starting at $9/mo &middot; Cancel anytime
        </p>
      </div>
    </motion.div>
  );
}
