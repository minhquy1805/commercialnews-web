import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminUserListRequest } from "../types/adminUser.types";

export const ADMIN_USERS_QUERY_KEY = ["admin", "identity", "users"] as const;

export function useInvalidateAdminUsersQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_USERS_QUERY_KEY,
    });
  };
}

export function useAdminUsers(request: AdminUserListRequest) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, request],
    queryFn: () => adminUsersApi.listUsers(request),
    retry: false,
  });
}
