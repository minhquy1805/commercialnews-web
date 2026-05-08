import { useMutation } from "@tanstack/react-query";
import { adminUserRolesApi } from "../api/adminUserRolesApi";
import type { AdminRevokeRoleFromUserRequest } from "../types/adminUserRole.types";
import { useInvalidateAdminUserRolesQueries } from "./useAdminUserRoles";

export function useRevokeRoleFromUser() {
  const invalidateAdminUserRolesQueries = useInvalidateAdminUserRolesQueries();

  return useMutation({
    mutationFn: (request: AdminRevokeRoleFromUserRequest) =>
      adminUserRolesApi.revokeRoleFromUser(request),
    onSuccess: invalidateAdminUserRolesQueries,
  });
}
