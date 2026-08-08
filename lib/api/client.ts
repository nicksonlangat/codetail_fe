import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Concurrent 401s share one in-flight refresh instead of each firing their own.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const res = await axios.post<{ access_token: string }>(
    `${apiClient.defaults.baseURL}/auth/refresh`,
    { refresh_token: refreshToken }
  );
  return res.data.access_token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const isAuthRoute = original?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        if (typeof window !== "undefined") window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        refreshPromise ??= refreshAccessToken(refreshToken).finally(() => {
          refreshPromise = null;
        });
        const newAccess = await refreshPromise;
        setTokens(newAccess, refreshToken);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch {
        logout();
        if (typeof window !== "undefined") window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail;
    if (detail) return detail;
  }
  return fallback;
}

export default apiClient;
