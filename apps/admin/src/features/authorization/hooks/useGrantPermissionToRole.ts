import { useMutation } from "@tanstack/react-query";
import { adminRolePermissionsApi } from "../api/adminRolePermissionsApi";
import type { AdminGrantPermissionToRoleRequest } from "../types/adminRolePermission.types";
import { useInvalidateAdminRolePermissionsQueries } from "./useAdminRolePermissions";

export function useGrantPermissionToRole() {
  const invalidateAdminRolePermissionsQueries =
    useInvalidateAdminRolePermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminGrantPermissionToRoleRequest) =>
      adminRolePermissionsApi.grantPermissionToRole(request),
    onSuccess: invalidateAdminRolePermissionsQueries,
  });
}
