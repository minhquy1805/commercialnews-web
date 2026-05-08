import { useMutation } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type { AdminUpdatePermissionRequest } from "../types/adminPermission.types";
import { useInvalidateAdminPermissionsQueries } from "./useAdminPermissions";

export function useUpdateAdminPermission() {
  const invalidateAdminPermissionsQueries =
    useInvalidateAdminPermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminUpdatePermissionRequest) =>
      adminPermissionsApi.updatePermission(request),
    onSuccess: invalidateAdminPermissionsQueries,
  });
}
