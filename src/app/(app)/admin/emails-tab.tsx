"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export function EmailsTab() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
          <Mail className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <h3 className="text-[13px] font-semibold mb-1">Email tracking coming soon</h3>
        <p className="text-[11px] text-muted-foreground/50 text-center max-w-[280px]">
          Transactional emails (OTP, tier changes) are sent but not yet logged. Add an email log model to track delivery status, recipients, and history.
        </p>
      </motion.div>
    </div>
  );
}
