"use client";

import { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";

export function UnlockProCard({ count, unitLabel }: { count: number; unitLabel: string }) {
  const [open, setOpen] = useState(false);
  const label = `Unlock ${count} more ${count === 1 ? "problem" : "problems"} in ${unitLabel}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 w-full text-left rounded-lg border border-brand-sky/30 bg-brand-sky/5 px-4 py-3.5 cursor-pointer outline-none transition-all duration-500 hover:border-brand-sky/60 hover:bg-brand-sky/8"
      >
        <span className="size-8 rounded-lg bg-brand-sky/15 flex items-center justify-center shrink-0">
          <Zap className="size-4 text-brand-sky" fill="currentColor" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-brand-text">{label}</p>
          <p className="text-[11px] text-brand-text-muted mt-0.5">
            Go Pro for every path, unlimited.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-brand-sky px-3.5 py-2 rounded-lg shrink-0 transition-all duration-500 group-hover:bg-brand-sky/90">
          Upgrade
          <ArrowRight className="size-3.5 transition-all duration-500 group-hover:translate-x-0.5" />
        </span>
      </button>

      <UpgradeModal open={open} onClose={() => setOpen(false)} trigger={`${label}.`} />
    </>
  );
}
