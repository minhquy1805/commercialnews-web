import { useMutation } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type { AdminRoleActionRequest } from "../types/adminRole.types";
import { useInvalidateAdminRolesQueries } from "./useAdminRoles";

export function useActivateAdminRole() {
  const invalidateAdminRolesQueries = useInvalidateAdminRolesQueries();

  return useMutation({
    mutationFn: (request: AdminRoleActionRequest) =>
      adminRolesApi.activateRole(request),
    onSuccess: invalidateAdminRolesQueries,
  });
}
