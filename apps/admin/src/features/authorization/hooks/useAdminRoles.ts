import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type { AdminRoleListRequest } from "../types/adminRole.types";

export const ADMIN_ROLES_QUERY_KEY = ["admin", "authorization", "roles"] as const;

export function useInvalidateAdminRolesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_ROLES_QUERY_KEY,
    });
  };
}

export function useAdminRoles(request: AdminRoleListRequest) {
  return useQuery({
    queryKey: [...ADMIN_ROLES_QUERY_KEY, request],
    queryFn: () => adminRolesApi.getRoles(request),
    retry: false,
  });
}
