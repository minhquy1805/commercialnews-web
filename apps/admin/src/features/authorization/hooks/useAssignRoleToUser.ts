import { useMutation } from "@tanstack/react-query";
import { adminUserRolesApi } from "../api/adminUserRolesApi";
import type { AdminAssignRoleToUserRequest } from "../types/adminUserRole.types";
import { useInvalidateAdminUserRolesQueries } from "./useAdminUserRoles";

export function useAssignRoleToUser() {
  const invalidateAdminUserRolesQueries = useInvalidateAdminUserRolesQueries();

  return useMutation({
    mutationFn: (request: AdminAssignRoleToUserRequest) =>
      adminUserRolesApi.assignRoleToUser(request),
    onSuccess: invalidateAdminUserRolesQueries,
  });
}
