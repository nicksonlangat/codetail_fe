import apiClient from "./client";

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

export async function verifyOtp(email: string, otp_code: string) {
  const res = await apiClient.post<TokenResponse>("/auth/verify", {
    email,
    otp_code,
  });
  return res.data;
}

export async function resendOtp(email: string) {
  const res = await apiClient.post<{ message: string }>("/auth/resend-otp", {
    email,
  });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<TokenResponse>("/auth/login", {
    email,
    password,
  });
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get<UserResponse>("/auth/me");
  return res.data;
}
