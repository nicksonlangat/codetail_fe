"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Crown, Rocket, WandSparkles, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { createCheckout, getSubscription, upgradeSubscription, type SubscriptionInfo } from "@/lib/api/billing";
import { getErrorMessage } from "@/lib/api/client";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { getMe } from "@/lib/api/auth";
import { toast } from "sonner";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const PRO_FEATURES = [
  "All problems unlocked",
  "Unlimited AI reviews",
  "Unlimited AI hints",
  "Unlimited solution reveals",
  "AI-generated custom challenges",
  "Daily practice emails",
  "Full progress analytics",
  "Priority support",
];

const PREMIUM_FEATURES = [
  "Everything in Pro",
  "AI resume builder",
  "PDF export (10 templates)",
  "GitHub project import",
  "Resume ATS analysis",
  "Priority support",
];

function Spinner() {
  return (
    <svg className="animate-spin size-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

async function pollUntilActive(maxAttempts = 15): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const sub = await getSubscription();
      if (sub.status === "active") return true;
    } catch {}
  }
  return false;
}

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<"pro" | "premium" | null>(null);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  const currentTier = user?.tier ?? "free";

  async function syncUser() {
    try {
      const me = await getMe();
      setUser(me as Parameters<typeof setUser>[0]);
    } catch {}
  }

  useEffect(() => {
    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as "sandbox" | "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
      eventCallback: async (event) => {
        if (event.name === "checkout.completed") {
          setActivating(true);
          toast.loading("Activating your plan...", { id: "plan-activate" });
          const activated = await pollUntilActive();
          if (activated) {
            await syncUser();
            toast.success("You're all set! Your plan is now active.", { id: "plan-activate" });
          } else {
            toast.error("Payment received — plan update may take a moment. Refresh if needed.", { id: "plan-activate" });
          }
          setActivating(false);
          setSubscription(await getSubscription().catch(() => null));
        }
      },
    }).then(setPaddle);
    getSubscription().then(setSubscription).catch(() => {});
  }, []);

  const hasActiveSub = subscription?.status === "active";

  async function handleUpgrade(planId: "pro" | "premium") {
    setError(null);
    setLoading(planId);
    try {
      if (hasActiveSub) {
        toast.loading("Upgrading your plan...", { id: "plan-upgrade" });
        await upgradeSubscription({ plan_id: planId, billing_cycle: yearly ? "yearly" : "monthly" });
        await syncUser();
        setSubscription(await getSubscription().catch(() => null));
        toast.success(`You're now on ${planId.charAt(0).toUpperCase() + planId.slice(1)}!`, { id: "plan-upgrade" });
      } else {
        const { payment_id } = await createCheckout({
          plan_id: planId,
          billing_cycle: yearly ? "yearly" : "monthly",
        });
        if (paddle) {
          paddle.Checkout.open({ transactionId: payment_id });
        }
      }
    } catch (err) {
      toast.dismiss("plan-upgrade");
      setError(getErrorMessage(err, "Could not process upgrade. Please try again."));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full max-w-4xl px-6 py-10">
      {activating && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-primary/5 border border-brand-primary/20 text-sm text-brand-primary">
          <Spinner />
          Activating your plan — hang tight...
        </div>
      )}

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-1.5">
          Billing
        </p>
        <h1 className="text-2xl font-bold text-brand-text">Upgrade your plan</h1>
        <p className="mt-1.5 text-sm text-brand-text-muted">
          You&apos;re currently on the{" "}
          <span className="font-semibold capitalize text-brand-text">{currentTier}</span> plan.
        </p>
      </div>

      <div className="mb-8 inline-flex items-center gap-1 rounded-lg border border-brand-border p-1">
        {(["monthly", "yearly"] as const).map((opt) => {
          const active = (opt === "yearly") === yearly;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setYearly(opt === "yearly")}
              className="relative px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all duration-500"
            >
              {active && (
                <motion.span
                  layoutId="billing-tab"
                  transition={SP}
                  className="absolute inset-0 rounded-md bg-brand-primary"
                />
              )}
              <span className={`relative z-10 ${active ? "text-white" : "text-brand-text-muted"}`}>
                {opt === "monthly" ? "Monthly" : "Yearly — save 25%"}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-brand-destructive/5 border border-brand-destructive/20 text-sm text-brand-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pro */}
        <div className="relative rounded-xl border-2 border-brand-primary/40 bg-brand-primary/5 p-6">
          <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
            Most Popular
          </span>

          <div className="flex items-center gap-2 mb-3">
            <span className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
              <WandSparkles className="size-4 text-brand-primary" />
            </span>
            <h2 className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Pro</h2>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-brand-text">
              ${yearly ? "7.50" : "10"}
            </span>
            <span className="text-sm text-brand-text-muted">/ month</span>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-0.5 mb-5">
            {yearly ? "Billed $90/year" : "or $90/year, save $30"}
          </p>

          {currentTier === "pro" ? (
            <div className="flex items-center justify-center gap-1.5 w-full text-center text-[13px] font-semibold text-brand-primary bg-brand-primary/10 py-2.5 rounded-lg">
              <Crown className="size-3.5" />
              Current plan
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={() => handleUpgrade("pro")}
              disabled={loading !== null}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={SP}
              className="flex items-center justify-center gap-1.5 w-full text-[13px] font-semibold text-white bg-brand-primary py-2.5 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === "pro" ? <Spinner /> : <Zap className="size-3.5" />}
              {loading === "pro" ? "Processing..." : "Upgrade to Pro"}
            </motion.button>
          )}

          <div className="mt-6 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span className="text-[13px] text-brand-text">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div className="relative rounded-xl border border-brand-border bg-gradient-to-b from-brand-surface to-transparent p-6">
          <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-brand-text-muted bg-brand-surface border border-brand-border px-2 py-0.5 rounded-full">
            14-day free trial
          </span>

          <div className="flex items-center gap-2 mb-3">
            <span className="size-8 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
              <Rocket className="size-4 text-brand-text" />
            </span>
            <h2 className="text-xs font-semibold text-brand-text uppercase tracking-wide">Premium</h2>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-brand-text">
              ${yearly ? "15" : "20"}
            </span>
            <span className="text-sm text-brand-text-muted">/ month</span>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-0.5 mb-5">
            {yearly ? "Billed $180/year" : "or $180/year, save $60"}
          </p>

          {currentTier === "premium" ? (
            <div className="flex items-center justify-center gap-1.5 w-full text-center text-[13px] font-semibold text-brand-text bg-brand-surface border border-brand-border py-2.5 rounded-lg">
              <Rocket className="size-3.5" />
              Current plan
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={() => handleUpgrade("premium")}
              disabled={loading !== null}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={SP}
              className="flex items-center justify-center gap-1.5 w-full text-[13px] font-semibold text-brand-text border border-brand-border py-2.5 rounded-lg cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === "premium" ? <Spinner /> : <Rocket className="size-3.5" />}
              {loading === "premium" ? "Processing..." : "Try Premium free"}
            </motion.button>
          )}

          <p className="text-[11px] text-brand-text-subtle text-center mt-2">No credit card required</p>

          <div className="mt-5 space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-brand-text-subtle shrink-0 mt-0.5" />
                <span className="text-[13px] text-brand-text-muted">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-[12px] text-brand-text-subtle text-center">
        Payments are processed securely by Paddle. Cancel anytime.
      </p>
    </div>
  );
}
