"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { createCheckout, getSubscription } from "@/lib/api/billing";
import { useAuthStore } from "@/stores/auth-store";

const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as "sandbox" | "production";

export function useCheckout() {
  const paddleRef = useRef<Paddle | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  // Keep auth refs so the Paddle eventCallback never holds a stale closure
  const { user, setUser } = useAuthStore();
  const userRef    = useRef(user);
  const setUserRef = useRef(setUser);
  useEffect(() => { userRef.current = user; },    [user]);
  useEffect(() => { setUserRef.current = setUser; }, [setUser]);

  // Poll /payments/subscription/ until status flips to active
  const pollForActivation = useCallback(async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const sub = await getSubscription();
        if (sub.status === "active" && sub.plan === "pro") {
          const u = userRef.current;
          if (u) setUserRef.current({ ...u, tier: "pro" });
          setSuccess(true);
          return;
        }
      } catch { /* webhook may not have arrived yet */ }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }, []);

  // Keep a ref to pollForActivation so the Paddle eventCallback always
  // calls the latest version even though it's set up once at mount time
  const pollRef = useRef(pollForActivation);
  useEffect(() => { pollRef.current = pollForActivation; }, [pollForActivation]);

  // Initialize Paddle SDK once
  useEffect(() => {
    if (!PADDLE_TOKEN || paddleRef.current) return;

    initializePaddle({
      token: PADDLE_TOKEN,
      environment: PADDLE_ENV,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "en",
        },
      },
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          pollRef.current();
        }
      },
    }).then((paddle) => {
      paddleRef.current = paddle ?? null;
    });
  }, []);

  const startCheckout = useCallback(async (planId: string, billingCycle: string) => {
    if (!paddleRef.current) {
      setError("Payment system not ready — please refresh and try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await createCheckout(planId, billingCycle);

      // The checkout_url contains _ptxn — we only need that to open the overlay.
      // We never redirect to the URL itself.
      const txnId = new URL(data.checkout_url).searchParams.get("_ptxn");

      if (!txnId) {
        setError("Invalid checkout response — missing transaction ID.");
        return;
      }

      paddleRef.current.Checkout.open({ transactionId: txnId });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Failed to start checkout. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { startCheckout, loading, error, success };
}
