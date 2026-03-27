import apiClient from "./client";

export interface CheckoutResponse {
  checkout_url: string;
  payment_id: string;
  provider: string;
}

export async function createCheckout(planId: string, billingCycle: string) {
  const res = await apiClient.post<CheckoutResponse>("/payments/checkout/paddle/", {
    plan_id: planId,
    billing_cycle: billingCycle,
  });
  return res.data;
}

export interface SubscriptionInfo {
  plan: string;
  billing_cycle: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_date: string | null;
  cancelled_at: string | null;
}

export async function getSubscription() {
  const res = await apiClient.get<SubscriptionInfo>("/payments/subscription/");
  return res.data;
}

export async function cancelSubscription() {
  const res = await apiClient.post("/payments/cancel/");
  return res.data;
}

export interface PlanInfo {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

export async function getPlans() {
  const res = await apiClient.get<PlanInfo[]>("/payments/plans/");
  return res.data;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export async function getPaymentHistory() {
  const res = await apiClient.get<PaymentHistoryItem[]>("/payments/history/");
  return res.data;
}
