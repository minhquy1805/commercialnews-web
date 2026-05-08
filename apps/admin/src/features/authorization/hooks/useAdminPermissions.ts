import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type { AdminPermissionListRequest } from "../types/adminPermission.types";

export const ADMIN_PERMISSIONS_QUERY_KEY = [
  "admin",
  "authorization",
  "permissions",
] as const;

export function useInvalidateAdminPermissionsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_PERMISSIONS_QUERY_KEY,
    });
  };
}

export function useAdminPermissions(request: AdminPermissionListRequest) {
  return useQuery({
    queryKey: [...ADMIN_PERMISSIONS_QUERY_KEY, request],
    queryFn: () => adminPermissionsApi.getPermissions(request),
    retry: false,
  });
}
