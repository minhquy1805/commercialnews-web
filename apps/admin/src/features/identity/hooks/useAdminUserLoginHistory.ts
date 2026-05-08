import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminUserLoginHistoryRequest } from "../types/adminUser.types";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsers";

export function useAdminUserLoginHistory(
  request: AdminUserLoginHistoryRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, "login-history", request],
    queryFn: () => adminUsersApi.getUserLoginHistory(request),
    enabled: Boolean(request.userId),
    retry: false,
  });
}
