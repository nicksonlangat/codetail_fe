"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles, Zap, Code2, Database, Layout, Webhook, Flame, Bot, BookOpen, Infinity } from "lucide-react";
import { useEffect } from "react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: string;
}

const whyPro = [
  { icon: Infinity, label: "Unlimited AI challenges", description: "Generate fresh problems on any topic, any time" },
  { icon: Bot, label: "Unlimited AI reviews", description: "Get senior-dev feedback on every solution you write" },
  { icon: BookOpen, label: "Full solution library", description: "Step-by-step explanations with complexity analysis" },
  { icon: Flame, label: "Daily practice emails", description: "5 curated problems delivered every morning" },
];

const paths = [
  { icon: Code2, label: "Python Fundamentals", problems: "20 problems" },
  { icon: Database, label: "Django Models", problems: "10 problems" },
  { icon: Layout, label: "Django Fundamentals", problems: "10 problems" },
  { icon: Webhook, label: "Django REST Framework", problems: "10 problems" },
];

export function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          <motion.div
            className="relative w-full max-w-[480px] mx-4 rounded-2xl border border-border bg-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={spring}>

            <button onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500 z-10">
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold tracking-tight">Go Pro</h2>
                  <p className="text-[11px] text-muted-foreground">Everything you need to level up</p>
                </div>
              </div>
              {trigger && (
                <p className="text-[12px] text-muted-foreground mt-2 bg-muted rounded-lg px-3 py-2">{trigger}</p>
              )}
            </div>

            {/* What you get */}
            <div className="px-6 py-4 space-y-3">
              {whyPro.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Paths included */}
            <div className="px-6 pb-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Full access to every path</p>
              <div className="grid grid-cols-2 gap-2">
                {paths.map((path) => {
                  const Icon = path.icon;
                  return (
                    <div key={path.label} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 border border-border/50">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-[11px] font-medium text-foreground">{path.label}</p>
                        <p className="text-[9px] text-muted-foreground">{path.problems}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 cursor-pointer transition-colors duration-100">
                <Zap className="w-4 h-4" />
                Upgrade to Pro — $9/mo
              </motion.button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/50">Cancel anytime · 14-day money-back guarantee</span>
              <button onClick={onClose} className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
