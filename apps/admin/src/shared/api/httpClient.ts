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
  accessTokenExpiresAtUtc: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE_URL = "/api/v1/auth";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshHttpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let authRefreshPromise: Promise<RefreshTokenResponse> | null = null;

function isAuthLoginUrl(url?: string): boolean {
  return Boolean(url?.includes(`${AUTH_BASE_URL}/login`));
}

function isAuthRefreshUrl(url?: string): boolean {
  return Boolean(url?.includes(`${AUTH_BASE_URL}/refresh`));
}

function isAuthLogoutUrl(url?: string): boolean {
  return Boolean(url?.includes(`${AUTH_BASE_URL}/logout`));
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
      isAuthLoginUrl(originalRequest.url) ||
      isAuthRefreshUrl(originalRequest.url) ||
      isAuthLogoutUrl(originalRequest.url)
    ) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      authRefreshPromise ??= refreshHttpClient
        .post<RefreshTokenResponse>(`${AUTH_BASE_URL}/refresh`)
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
