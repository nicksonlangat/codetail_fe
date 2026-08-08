import { motion } from "framer-motion";
import { Award, PartyPopper, X, Zap } from "lucide-react";
import { badgeLabel } from "@/lib/badges";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

interface SolvedBannerProps {
  xpEarned: number;
  badges: string[];
  onDismiss: () => void;
}

export function SolvedBanner({ xpEarned, badges, onDismiss }: SolvedBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={SPRING}
      className="flex items-center gap-3 px-5 py-2.5 bg-brand-success/8 border-b border-brand-success/25 shrink-0"
    >
      <PartyPopper className="size-4 text-brand-success shrink-0" />
      <p className="text-[13px] text-brand-text flex-1">
        Solved! <span className="font-semibold">+{xpEarned} XP</span>
        {badges.length > 0 && (
          <span className="inline-flex items-center gap-1 ml-2">
            <Award className="size-3.5 text-brand-warning" />
            New badge: <span className="font-semibold">{badges.map(badgeLabel).join(", ")}</span>
          </span>
        )}
      </p>
      <Zap className="size-3.5 text-brand-success shrink-0" fill="currentColor" />
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg text-brand-text-subtle cursor-pointer outline-none transition-all duration-500 hover:bg-white hover:text-brand-text shrink-0"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
}
