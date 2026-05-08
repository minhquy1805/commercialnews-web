import { useMutation } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminLockUserRequest } from "../types/adminUser.types";
import { useInvalidateAdminUsersQueries } from "./useAdminUsers";

export function useLockAdminUser() {
  const invalidateAdminUsersQueries = useInvalidateAdminUsersQueries();

  return useMutation({
    mutationFn: (request: AdminLockUserRequest) =>
      adminUsersApi.lockUser(request),
    onSuccess: invalidateAdminUsersQueries,
  });
}
