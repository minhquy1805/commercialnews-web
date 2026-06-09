"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { tokenStorage } from "@/shared/auth/tokenStorage";

function getAuthSnapshot() {
  return tokenStorage.getAccessToken();
}

function getServerSnapshot() {
  return null;
}

export function useCurrentUser() {
  const accessToken = useSyncExternalStore(
    tokenStorage.subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );

  const query = useQuery({
    queryKey: ["auth", "current-user", accessToken],
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 60 * 1000,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        tokenStorage.clearAccessToken();
        throw error;
      }
    },
  });

  return {
    currentUser: accessToken ? query.data ?? null : null,
    isAuthenticated: Boolean(accessToken && query.data),
    isLoading: Boolean(accessToken && query.isLoading),
    isInitialized: !accessToken || query.isSuccess || query.isError,
    error: query.error,
    reloadCurrentUser: query.refetch,
  };
}