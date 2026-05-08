import { useMutation } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type { AdminUpdateRoleRequest } from "../types/adminRole.types";
import { useInvalidateAdminRolesQueries } from "./useAdminRoles";

export function useUpdateAdminRole() {
  const invalidateAdminRolesQueries = useInvalidateAdminRolesQueries();

  return useMutation({
    mutationFn: (request: AdminUpdateRoleRequest) =>
      adminRolesApi.updateRole(request),
    onSuccess: invalidateAdminRolesQueries,
  });
}
