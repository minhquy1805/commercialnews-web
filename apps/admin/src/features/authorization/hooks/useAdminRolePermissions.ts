import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminRolePermissionsApi } from "../api/adminRolePermissionsApi";

export const ADMIN_ROLE_PERMISSIONS_QUERY_KEY = [
  "admin",
  "authorization",
  "role-permissions",
] as const;

export function useInvalidateAdminRolePermissionsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_ROLE_PERMISSIONS_QUERY_KEY,
    });
  };
}

export function useAdminRolePermissions(roleId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_ROLE_PERMISSIONS_QUERY_KEY, "role", roleId],
    queryFn: () => adminRolePermissionsApi.getRolePermissions(roleId!),
    enabled: Boolean(roleId),
    retry: false,
  });
}

export function useAdminPermissionRoles(permissionId?: number | null) {
  return useQuery({
    queryKey: [...ADMIN_ROLE_PERMISSIONS_QUERY_KEY, "permission", permissionId],
    queryFn: () => adminRolePermissionsApi.getPermissionRoles(permissionId!),
    enabled: Boolean(permissionId),
    retry: false,
  });
}
