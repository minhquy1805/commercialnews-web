import { useQueries } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import type { AdminUserDetailResponse } from "../types/adminUser.types";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsers";

export function useAdminUserDetails(userIds: number[]) {
  const uniqueUserIds = [...new Set(userIds)].sort(
    (left, right) => left - right,
  );
  const userQueries = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: [...ADMIN_USERS_QUERY_KEY, "detail", userId],
      queryFn: () => adminUsersApi.getUserDetail(userId),
      retry: false,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const usersById = new Map<number, AdminUserDetailResponse>();

  userQueries.forEach((query, index) => {
    if (query.data) {
      usersById.set(uniqueUserIds[index], query.data);
    }
  });

  return {
    usersById,
    isFetching: userQueries.some((query) => query.isFetching),
    isError: userQueries.some((query) => query.isError),
  };
}
