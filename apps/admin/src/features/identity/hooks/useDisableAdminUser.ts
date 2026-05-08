import { useMutation } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminDisableUserRequest } from "../types/adminUser.types";
import { useInvalidateAdminUsersQueries } from "./useAdminUsers";

export function useDisableAdminUser() {
  const invalidateAdminUsersQueries = useInvalidateAdminUsersQueries();

  return useMutation({
    mutationFn: (request: AdminDisableUserRequest) =>
      adminUsersApi.disableUser(request),
    onSuccess: invalidateAdminUsersQueries,
  });
}
