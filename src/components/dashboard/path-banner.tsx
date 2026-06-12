"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/progress";
import { getIcon } from "@/lib/icons";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export function PathBanner() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 30000,
  });

  if (isLoading) {
    return <div className="h-14 rounded-lg bg-muted animate-pulse" />;
  }

  const primary = dashboard?.active_paths?.[0];

  if (!primary) return null;

  const Icon = getIcon(primary.path_icon);
  const remaining = dashboard?.remaining_in_closest ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="flex items-center gap-5 px-5 py-3.5 rounded-lg border-l-[3px] border-l-primary border border-border bg-card"
    >
      {/* Path identity */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[13px] font-semibold text-foreground">{primary.path_title}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${primary.pct}%` }}
            transition={{ ...spring, delay: 0.1 }}
          />
        </div>
        <span className="text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
          {primary.solved}<span className="text-muted-foreground/40"> / {primary.total}</span>
        </span>
      </div>

      {/* Insight */}
      {remaining > 0 && (
        <span className="text-[11px] text-muted-foreground shrink-0 hidden lg:block">
          {remaining} left to complete
        </span>
      )}

      {/* CTA */}
      <Link href={`/paths/${primary.path_slug}`}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-[12px] font-semibold cursor-pointer shrink-0 hover:bg-primary/90 transition-colors duration-150"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
