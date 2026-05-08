import { useMutation } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminUserActionReasonRequest } from "../types/adminUser.types";
import { useInvalidateAdminUsersQueries } from "./useAdminUsers";

export function useRevokeAdminUserSessions() {
  const invalidateAdminUsersQueries = useInvalidateAdminUsersQueries();

  return useMutation({
    mutationFn: (request: AdminUserActionReasonRequest) =>
      adminUsersApi.revokeUserSessions(request),
    onSuccess: invalidateAdminUsersQueries,
  });
}
