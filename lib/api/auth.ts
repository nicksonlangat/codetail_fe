import apiClient from "./client";

export { getErrorMessage } from "./client";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  tier: "free" | "pro";
  is_admin: boolean;
  is_verified: boolean;
  xp: number;
  badges: string[];
  streak_days: number;
  created_at: string;
}

export async function signup(email: string, name: string, password: string) {
  const res = await apiClient.post<{ message: string }>("/auth/signup", {
    email,
    name,
    password,
  });
  return res.data;
}

export async function verifyOtp(email: string, otpCode: string) {
  const res = await apiClient.post<TokenResponse>("/auth/verify", {
    email,
    otp_code: otpCode,
  });
  return res.data;
}

export async function resendOtp(email: string) {
  const res = await apiClient.post<{ message: string }>("/auth/resend-otp", { email });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<TokenResponse>("/auth/login", { email, password });
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get<UserResponse>("/auth/me");
  return res.data;
}

export interface RankResponse {
  xp: number;
  xp_today: number;
  xp_week: number;
  xp_month: number;
  badges: string[];
  streak_days: number;
  problems_solved: number;
  active_days: number[];
}

export async function getRank() {
  const res = await apiClient.get<RankResponse>("/auth/me/rank");
  return res.data;
}

export async function getActivity(year: number, month: number): Promise<Record<number, number>> {
  const res = await apiClient.get<{ activity: Record<number, number> }>("/auth/me/activity", {
    params: { year, month },
  });
  return res.data.activity;
}
