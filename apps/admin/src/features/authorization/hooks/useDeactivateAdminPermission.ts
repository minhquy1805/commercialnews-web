import { useMutation } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type { AdminPermissionActionRequest } from "../types/adminPermission.types";
import { useInvalidateAdminPermissionsQueries } from "./useAdminPermissions";

export function useDeactivateAdminPermission() {
  const invalidateAdminPermissionsQueries =
    useInvalidateAdminPermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminPermissionActionRequest) =>
      adminPermissionsApi.deactivatePermission(request),
    onSuccess: invalidateAdminPermissionsQueries,
  });
}
