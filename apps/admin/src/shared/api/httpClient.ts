import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../auth/tokenStorage";

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshTokenResponse = {
  userId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshHttpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;

function isRefreshTokenUrl(url?: string): boolean {
  return Boolean(url?.includes("/api/v1/identity/refresh-token"));
}

function isLoginUrl(url?: string): boolean {
  return Boolean(url?.includes("/api/v1/identity/login"));
}

function redirectToLogin() {
  tokenStorage.clearTokens();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (
      originalRequest._retry ||
      isLoginUrl(originalRequest.url) ||
      isRefreshTokenUrl(originalRequest.url)
    ) {
      redirectToLogin();
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshTokenPromise ??= refreshHttpClient
        .post<RefreshTokenResponse>("/api/v1/identity/refresh-token", {
          refreshToken,
        })
        .then((response) => response.data)
        .finally(() => {
          refreshTokenPromise = null;
        });

      const refreshedToken = await refreshTokenPromise;

      tokenStorage.setTokens(
        refreshedToken.accessToken,
        refreshedToken.refreshToken,
      );

      originalRequest.headers.Authorization = `Bearer ${refreshedToken.accessToken}`;

      return httpClient(originalRequest as AxiosRequestConfig);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);