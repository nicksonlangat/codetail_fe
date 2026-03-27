"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { createCheckout, getSubscription } from "@/lib/api/billing";
import { useAuthStore } from "@/stores/auth-store";

const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as "sandbox" | "production";

export function useCheckout() {
  const paddleRef = useRef<Paddle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  // Initialize Paddle SDK
  useEffect(() => {
    if (!PADDLE_TOKEN || paddleRef.current) return;

    initializePaddle({
      token: PADDLE_TOKEN,
      environment: PADDLE_ENV,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
        },
      },
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          pollForActivation();
        }
      },
    }).then((paddle) => {
      paddleRef.current = paddle ?? null;
    });
  }, []);

  const pollForActivation = useCallback(async () => {
    const maxAttempts = 10;
    const interval = 3000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const sub = await getSubscription();
        if (sub.status === "active" && sub.plan === "pro") {
          // Update user tier in auth store
          if (user) {
            setUser({ ...user, tier: "pro" });
          }
          return;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, interval));
    }
  }, [user, setUser]);

  const startCheckout = useCallback(async (planId: string, billingCycle: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createCheckout(planId, billingCycle);

      // Extract transaction ID from checkout URL
      const url = new URL(data.checkout_url);
      const txnId = url.searchParams.get("_ptxn");

      if (txnId && paddleRef.current) {
        paddleRef.current.Checkout.open({ transactionId: txnId });
      } else {
        // Fallback: open in new tab
        window.open(data.checkout_url, "_blank");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }, []);

  return { startCheckout, loading, error };
}
