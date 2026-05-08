import { useMutation } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type { AdminCreatePermissionRequest } from "../types/adminPermission.types";
import { useInvalidateAdminPermissionsQueries } from "./useAdminPermissions";

export function useCreateAdminPermission() {
  const invalidateAdminPermissionsQueries =
    useInvalidateAdminPermissionsQueries();

  return useMutation({
    mutationFn: (request: AdminCreatePermissionRequest) =>
      adminPermissionsApi.createPermission(request),
    onSuccess: invalidateAdminPermissionsQueries,
  });
}
