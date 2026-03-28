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

export async function triggerDailyDigest() {
  const res = await apiClient.post("/admin/digest/trigger");
  return res.data;
}
