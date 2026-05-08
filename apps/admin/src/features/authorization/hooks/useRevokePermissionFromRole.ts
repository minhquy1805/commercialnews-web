import { useMutation } from "@tanstack/react-query";
import { adminRolePermissionsApi } from "../api/adminRolePermissionsApi";
import type { AdminRevokePermissionFromRoleRequest } from "../types/adminRolePermission.types";
import { useInvalidateAdminRolePermissionsQueries } from "./useAdminRolePermissions";

export function useRevokePermissionFromRole() {
  const invalidateAdminRolePermissionsQueries =
    useInvalidateAdminRolePermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminRevokePermissionFromRoleRequest) =>
      adminRolePermissionsApi.revokePermissionFromRole(request),
    onSuccess: invalidateAdminRolePermissionsQueries,
  });
}
