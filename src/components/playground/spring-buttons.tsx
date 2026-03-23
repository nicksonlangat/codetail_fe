"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Star, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Spring config ── */
const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

/* ── Variant styles ── */
const variants: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  loading: "bg-primary text-primary-foreground opacity-70 cursor-not-allowed",
};

const sizes: Record<string, string> = {
  xs: "h-6 px-2 text-[11px] rounded-md gap-1",
  sm: "h-7 px-2.5 text-xs rounded-lg gap-1",
  default: "h-8 px-3 text-sm rounded-lg gap-1.5",
  lg: "h-9 px-4 text-sm rounded-lg gap-2",
};

/* ── Spring button ── */
function SpringBtn({
  variant = "primary",
  size = "default",
  disabled = false,
  className,
  children,
}: {
  variant?: string;
  size?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap select-none cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={spring}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

/* ── Exported composite ── */
export function SpringButtons() {
  return (
    <div className="py-6 space-y-8">
      {/* Variant row */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
          Variants
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SpringBtn variant="primary">Primary</SpringBtn>
          <SpringBtn variant="secondary">Secondary</SpringBtn>
          <SpringBtn variant="ghost">Ghost</SpringBtn>
          <SpringBtn variant="outline">Outline</SpringBtn>
          <SpringBtn variant="destructive">Destructive</SpringBtn>
          <SpringBtn variant="loading" disabled>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading...
          </SpringBtn>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
          Sizes
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <SpringBtn variant="primary" size="xs">Extra small</SpringBtn>
          <SpringBtn variant="primary" size="sm">Small</SpringBtn>
          <SpringBtn variant="primary" size="default">Default</SpringBtn>
          <SpringBtn variant="primary" size="lg">Large</SpringBtn>
        </div>
      </div>

      {/* Icon buttons */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
          Icon buttons
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer bg-primary text-primary-foreground"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer bg-secondary text-secondary-foreground"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
          >
            <Star className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border border-border text-foreground hover:bg-muted"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* CTA */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
          Call to action
        </p>
        <motion.button
          className="group inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        >
          Submit Solution
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 0 }}
          >
            <ArrowRight className="w-4 h-4 transition-all duration-500 group-hover:translate-x-1" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
