import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";
import type { GetMyLoginHistoryRequest } from "../types/auth.types";

export function useMyLoginHistory(request: GetMyLoginHistoryRequest) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me", "login-history", request],
    queryFn: () => authApi.getMyLoginHistory(request),
    enabled: isAuthenticated,
    retry: false,
  });
}
