import apiClient from "./client";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  is_admin: boolean;
  is_banned: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AdminUserList {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
}

export interface AdminUserDetail extends AdminUser {
  updated_at: string;
  problems_attempted: number;
  problems_solved: number;
  subscription: {
    plan: string;
    status: string;
    billing_cycle: string;
    current_period_end: string | null;
  } | null;
}

export interface PlatformStats {
  total_users: number;
  verified_users: number;
  pro_users: number;
  free_users: number;
  active_subscriptions: number;
  total_revenue: number;
  signups_per_day: { date: string; count: number }[];
}

export interface AdminSubscription {
  id: string;
  user_email: string;
  plan: string;
  status: string;
  billing_cycle: string;
  created_at: string;
}

export interface AdminPayment {
  id: string;
  user_email: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export async function getAdminUsers(search?: string, page = 1, perPage = 20) {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (search) params.search = search;
  const res = await apiClient.get<AdminUserList>("/admin/users", { params });
  return res.data;
}

export async function getAdminUserDetail(userId: string) {
  const res = await apiClient.get<AdminUserDetail>(`/admin/users/${userId}`);
  return res.data;
}

export async function changeUserTier(userId: string, tier: string) {
  const res = await apiClient.patch(`/admin/users/${userId}/tier`, { tier });
  return res.data;
}

export async function banUser(userId: string) {
  const res = await apiClient.post(`/admin/users/${userId}/ban`);
  return res.data;
}

export async function deleteUser(userId: string) {
  const res = await apiClient.delete(`/admin/users/${userId}`);
  return res.data;
}

export async function getPlatformStats() {
  const res = await apiClient.get<PlatformStats>("/admin/stats");
  return res.data;
}

export async function getAdminSubscriptions(page = 1, perPage = 20) {
  const res = await apiClient.get<AdminSubscription[]>("/admin/subscriptions", {
    params: { page, per_page: perPage },
  });
  return res.data;
}

export async function getAdminPayments(page = 1, perPage = 20) {
  const res = await apiClient.get<AdminPayment[]>("/admin/payments", {
    params: { page, per_page: perPage },
  });
  return res.data;
}

export interface AdminDigest {
  id: string;
  user_email: string;
  user_name: string;
  stack: string;
  problem_count: number;
  attempted_count: number;
  sent_at: string;
}

export interface AdminDigestList {
  digests: AdminDigest[];
  total: number;
  page: number;
  per_page: number;
}

export async function getAdminDigests(search?: string, page = 1, perPage = 20) {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (search) params.search = search;
  const res = await apiClient.get<AdminDigestList>("/admin/digests", { params });
  return res.data;
}

export async function triggerDailyDigest() {
  const res = await apiClient.post("/admin/digest/trigger");
  return res.data;
}

// ── Content ──

export interface PathSummary {
  id: string;
  title: string;
  slug: string;
  stack: string;
  difficulty: string;
  problem_count: number;
  is_active: boolean;
}

export interface ContentStats {
  total_paths: number;
  total_problems: number;
  generated_problems: number;
  hand_crafted_problems: number;
  by_difficulty: Record<string, number>;
  by_stack: Record<string, number>;
  by_type: Record<string, number>;
  paths: PathSummary[];
}

export async function getContentStats() {
  const res = await apiClient.get<ContentStats>("/admin/content");
  return res.data;
}

// ── Activity ──

export interface ActivityStats {
  total_attempts: number;
  total_solved: number;
  avg_score: number;
  total_ai_reviews: number;
  total_hints: number;
  total_solutions: number;
  solved_per_day: { date: string; count: number }[];
  ai_usage_per_day: { date: string; reviews: number; hints: number; solutions: number }[];
}

export async function getActivityStats() {
  const res = await apiClient.get<ActivityStats>("/admin/activity");
  return res.data;
}

// ── Webhooks ──

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  status: string;
  error: string | null;
  created_at: string;
}

export interface WebhookList {
  events: WebhookEvent[];
  total: number;
  page: number;
  per_page: number;
}

export async function getAdminWebhooks(status?: string, page = 1, perPage = 20) {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (status) params.status = status;
  const res = await apiClient.get<WebhookList>("/admin/webhooks", { params });
  return res.data;
}

// ── Enriched Stats ──

export interface EnrichedStats extends PlatformStats {
  mrr: number;
  conversion_rate: number;
}

export async function getEnrichedStats() {
  const res = await apiClient.get<EnrichedStats>("/admin/stats/enriched");
  return res.data;
}
