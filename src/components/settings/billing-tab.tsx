"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Sparkles, CreditCard, CheckCircle2, AlertCircle,
  XCircle, Clock, Zap, Loader2, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSubscription, getPaymentHistory, cancelSubscription } from "@/lib/api/billing";
import { useAuthStore } from "@/stores/auth-store";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);
}

const statusMap = {
  active:   { label: "Active",   Icon: CheckCircle2, cls: "text-green-600 bg-green-500/10 border-green-500/20" },
  cancelled:{ label: "Cancelled",Icon: XCircle,      cls: "text-destructive bg-destructive/10 border-destructive/20" },
  past_due: { label: "Past due", Icon: AlertCircle,  cls: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20" },
  trial:    { label: "Trial",    Icon: Clock,        cls: "text-primary bg-primary/10 border-primary/20" },
};

const proFeatures = [
  "Unlimited AI challenges",
  "Unlimited AI code reviews",
  "Full access to every path",
  "Daily curated practice emails",
];

export function BillingTab() {
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const qc = useQueryClient();

  const { data: sub, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    enabled: isPro,
    retry: false,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payment-history"],
    queryFn: getPaymentHistory,
    enabled: isPro,
    retry: false,
  });

  const { mutate: doCancel, isPending: cancelling } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscription"] }); setShowCancel(false); },
  });

  const status = sub?.status ? statusMap[sub.status as keyof typeof statusMap] : null;
  const isCancelled = !!sub?.cancelled_at;

  return (
    <>
      <div className="space-y-4 max-w-2xl">

        {/* Plan card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Plan</CardTitle>
            <CardDescription className="text-xs">Your current subscription.</CardDescription>
          </CardHeader>
          <CardContent>

            {/* FREE */}
            {!isPro && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-foreground">Free plan</p>
                        <span className="text-[9px] font-medium text-muted-foreground/60 bg-muted border border-border/50 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          Current
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">5 problems per path · 5 AI reviews/day</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                    onClick={() => setShowUpgrade(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 cursor-pointer transition-colors duration-100">
                    <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
                  </motion.button>
                </div>

                {/* What you're missing */}
                <div className="rounded-xl bg-muted/40 border border-border/50 px-4 py-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-2">Included with Pro</p>
                  {proFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 opacity-50">
                      <Check className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-[12px] text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRO loading */}
            {isPro && subLoading && (
              <div className="flex items-center gap-2 text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[12px]">Loading subscription…</span>
              </div>
            )}

            {/* PRO loaded */}
            {isPro && !subLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-foreground">Pro plan</p>
                      {status && (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${status.cls}`}>
                          <status.Icon className="w-2.5 h-2.5" /> {status.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                      {sub?.billing_cycle ?? "monthly"} billing
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 border border-border/40 px-3 py-2.5">
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-0.5">Current period</p>
                    <p className="text-[12px] font-medium text-foreground tabular-nums">
                      {formatDate(sub?.current_period_start ?? null)} – {formatDate(sub?.current_period_end ?? null)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 border border-border/40 px-3 py-2.5">
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-0.5">
                      {isCancelled ? "Access until" : "Renews on"}
                    </p>
                    <p className="text-[12px] font-medium text-foreground tabular-nums">
                      {formatDate(isCancelled ? sub?.current_period_end ?? null : sub?.next_billing_date ?? null)}
                    </p>
                  </div>
                </div>

                {/* What's included */}
                <div className="rounded-xl bg-primary/[0.04] border border-primary/10 px-4 py-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-primary/60 mb-2">All features unlocked</p>
                  {proFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-[12px] text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Cancel */}
                {sub?.status === "active" && !isCancelled && (
                  <div className="pt-1 border-t border-border/40">
                    {!showCancel ? (
                      <button onClick={() => setShowCancel(true)}
                        className="text-[12px] text-muted-foreground/60 hover:text-destructive cursor-pointer transition-all duration-500">
                        Cancel subscription
                      </button>
                    ) : (
                      <div className="flex items-center gap-4">
                        <p className="text-[12px] text-foreground">Cancel at end of billing period?</p>
                        <button onClick={() => doCancel()} disabled={cancelling}
                          className="text-[12px] font-medium text-destructive hover:opacity-70 cursor-pointer transition-all duration-500 disabled:opacity-50">
                          {cancelling ? "Cancelling…" : "Yes, cancel"}
                        </button>
                        <button onClick={() => setShowCancel(false)}
                          className="text-[12px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
                          Never mind
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isCancelled && (
                  <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    Your subscription is cancelled. Access continues until {formatDate(sub?.current_period_end ?? null)}.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment history */}
        {isPro && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment history</CardTitle>
              <CardDescription className="text-xs">Your recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[12px]">Loading…</span>
                </div>
              ) : !payments?.length ? (
                <p className="text-[12px] text-muted-foreground">No payments yet.</p>
              ) : (
                <div className="divide-y divide-border/40">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-[13px] text-foreground font-medium">{formatDate(p.created_at)}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{p.status}</p>
                      </div>
                      <p className="text-[13px] font-semibold font-mono tabular-nums text-foreground">
                        {formatAmount(p.amount, p.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
