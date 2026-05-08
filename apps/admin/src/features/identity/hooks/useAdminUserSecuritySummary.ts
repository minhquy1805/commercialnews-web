import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsers";

export function useAdminUserSecuritySummary(userId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, "security-summary", userId],
    queryFn: () => adminUsersApi.getUserSecuritySummary(userId!),
    enabled: Boolean(userId),
    retry: false,
  });
}
