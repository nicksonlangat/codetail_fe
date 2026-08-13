"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

function daysLeft(trialEndsAt: string): number {
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function TrialBanner() {
  const user = useAuthStore((s) => s.user);

  if (
    !user ||
    user.tier !== "premium" ||
    !user.trial_ends_at ||
    daysLeft(user.trial_ends_at) === 0
  ) {
    return null;
  }

  const days = daysLeft(user.trial_ends_at);
  const urgent = days <= 3;

  return (
    <div
      className={`w-full flex items-center justify-center gap-3 px-6 py-2 text-[12px] font-medium border-b transition-all duration-500 ${
        urgent
          ? "bg-brand-warning/10 border-brand-warning/30 text-brand-warning"
          : "bg-brand-primary-tint border-brand-primary-soft/40 text-brand-primary"
      }`}
    >
      <Sparkles className="size-3.5 shrink-0" />
      <span>
        {days === 1 ? "Last day" : `${days} days`} left in your free Premium trial. No credit card required to continue.
      </span>
      <Link
        href="/dashboard?upgrade=1"
        className="flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
      >
        Upgrade now <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
