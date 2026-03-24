import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Try refresh on 401 (not on auth endpoints, not on retry)
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.startsWith("/auth/")
    ) {
      original._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const newAccess = res.data.access_token;
          setTokens(newAccess, refreshToken);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(original);
        } catch {
          logout();
          if (typeof window !== "undefined") window.location.href = "/signin";
        }
      } else {
        logout();
        if (typeof window !== "undefined") window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
