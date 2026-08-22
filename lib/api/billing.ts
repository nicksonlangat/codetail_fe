import apiClient from "./client";

export interface CheckoutRequest {
  plan_id: "pro" | "premium";
  billing_cycle: "monthly" | "yearly";
}

export interface CheckoutResponse {
  checkout_url: string;
  payment_id: string;
  provider: string;
}

export interface SubscriptionInfo {
  plan: string;
  billing_cycle: string;
  status: string;
  current_period_end: string | null;
  next_billing_date: string | null;
  cancelled_at: string | null;
}

export async function createCheckout(req: CheckoutRequest): Promise<CheckoutResponse> {
  const res = await apiClient.post<CheckoutResponse>("/payments/checkout/paddle/", req);
  return res.data;
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  const res = await apiClient.get<SubscriptionInfo>("/payments/subscription/");
  return res.data;
}

export async function upgradeSubscription(req: CheckoutRequest): Promise<{ status: string; plan: string }> {
  const res = await apiClient.post("/payments/upgrade/", req);
  return res.data;
}
