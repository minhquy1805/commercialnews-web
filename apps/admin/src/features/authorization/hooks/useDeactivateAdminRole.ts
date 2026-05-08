import { useMutation } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type { AdminRoleActionRequest } from "../types/adminRole.types";
import { useInvalidateAdminRolesQueries } from "./useAdminRoles";

export function useDeactivateAdminRole() {
  const invalidateAdminRolesQueries = useInvalidateAdminRolesQueries();

  return useMutation({
    mutationFn: (request: AdminRoleActionRequest) =>
      adminRolesApi.deactivateRole(request),
    onSuccess: invalidateAdminRolesQueries,
  });
}
