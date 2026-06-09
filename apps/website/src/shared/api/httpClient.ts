import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "@/shared/auth/tokenStorage";

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshTokenResponse = {
  userId: number;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUTH_BASE_PATH = "/api/v1/auth";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshHttpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let authRefreshPromise: Promise<RefreshTokenResponse> | null = null;

function getPathname(url?: string): string {
  if (!url) {
    return "";
  }

  try {
    return new URL(
      url,
      API_BASE_URL ?? globalThis.location?.origin ?? "http://localhost",
    ).pathname;
  } catch {
    return url;
  }
}

function isAuthLoginUrl(url?: string): boolean {
  return getPathname(url) === `${AUTH_BASE_PATH}/login`;
}

function isAuthRefreshUrl(url?: string): boolean {
  return getPathname(url) === `${AUTH_BASE_PATH}/refresh`;
}

function isAuthLogoutUrl(url?: string): boolean {
  return getPathname(url) === `${AUTH_BASE_PATH}/logout`;
}

function redirectToLogin() {
  tokenStorage.clearAccessToken();

  if (typeof window === "undefined") {
    return;
  }

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
    const originalRequest = error.config as
      | RetryableAxiosRequestConfig
      | undefined;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthLoginUrl(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (
      originalRequest._retry ||
      isAuthRefreshUrl(originalRequest.url) ||
      isAuthLogoutUrl(originalRequest.url)
    ) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      authRefreshPromise ??= refreshHttpClient
        .post<RefreshTokenResponse>(`${AUTH_BASE_PATH}/refresh`)
        .then((response) => response.data)
        .finally(() => {
          authRefreshPromise = null;
        });

      const refreshedToken = await authRefreshPromise;

      tokenStorage.setAccessToken(refreshedToken.accessToken);

      originalRequest.headers.Authorization = `Bearer ${refreshedToken.accessToken}`;

      return httpClient(originalRequest as AxiosRequestConfig);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);