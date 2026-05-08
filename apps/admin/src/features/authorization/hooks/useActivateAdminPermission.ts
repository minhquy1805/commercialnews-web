import { useMutation } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type { AdminPermissionActionRequest } from "../types/adminPermission.types";
import { useInvalidateAdminPermissionsQueries } from "./useAdminPermissions";

export function useActivateAdminPermission() {
  const invalidateAdminPermissionsQueries =
    useInvalidateAdminPermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminPermissionActionRequest) =>
      adminPermissionsApi.activatePermission(request),
    onSuccess: invalidateAdminPermissionsQueries,
  });
}
