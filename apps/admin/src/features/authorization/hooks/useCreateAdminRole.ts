import { useMutation } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type { AdminCreateRoleRequest } from "../types/adminRole.types";
import { useInvalidateAdminRolesQueries } from "./useAdminRoles";

export function useCreateAdminRole() {
  const invalidateAdminRolesQueries = useInvalidateAdminRolesQueries();

  return useMutation({
    mutationFn: (request: AdminCreateRoleRequest) =>
      adminRolesApi.createRole(request),
    onSuccess: invalidateAdminRolesQueries,
  });
}
