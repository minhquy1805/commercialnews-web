import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserRolesApi } from "../api/adminUserRolesApi";
import type { AdminUserRoleItemResponse } from "../types/adminUserRole.types";

export const ADMIN_USER_ROLES_QUERY_KEY = [
  "admin",
  "authorization",
  "user-roles",
] as const;

export function useInvalidateAdminUserRolesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_USER_ROLES_QUERY_KEY,
    });
  };
}

export function useAdminUserRoles(userId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_USER_ROLES_QUERY_KEY, "user", userId],
    queryFn: () => adminUserRolesApi.getUserRoles(userId!),
    enabled: Boolean(userId),
    retry: false,
  });
}

export function useAdminUserRolesList(userIds: number[]) {
  const uniqueUserIds = [...new Set(userIds)].sort((left, right) => left - right);
  const userRoleQueries = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: [...ADMIN_USER_ROLES_QUERY_KEY, "user", userId],
      queryFn: () => adminUserRolesApi.getUserRoles(userId),
      retry: false,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const rolesByUserId = new Map<number, AdminUserRoleItemResponse[]>();

  userRoleQueries.forEach((query, index) => {
    if (query.data) {
      rolesByUserId.set(uniqueUserIds[index], query.data.roles);
    }
  });

  return {
    rolesByUserId,
    isFetching: userRoleQueries.some((query) => query.isFetching),
    isError: userRoleQueries.some((query) => query.isError),
  };
}

export function useAdminUserEffectivePermissions(userId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_USER_ROLES_QUERY_KEY, "effective-permissions", userId],
    queryFn: () => adminUserRolesApi.getUserEffectivePermissions(userId!),
    enabled: Boolean(userId),
    retry: false,
  });
}
