import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsers";

export function useAdminUserSessions(userId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, "sessions", userId],
    queryFn: () => adminUsersApi.getUserSessions(userId!),
    enabled: Boolean(userId),
    retry: false,
  });
}
