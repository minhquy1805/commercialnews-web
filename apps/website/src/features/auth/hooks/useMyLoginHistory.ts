"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { GetMyLoginHistoryRequest } from "../types/auth.types";

export function useMyLoginHistory(request: GetMyLoginHistoryRequest = {}) {
  const page = request.page ?? 1;
  const pageSize = request.pageSize ?? 10;

  return useQuery({
    queryKey: [
      "auth",
      "my-login-history",
      {
        succeeded: request.succeeded ?? null,
        fromAttemptedAt: request.fromAttemptedAt ?? null,
        toAttemptedAt: request.toAttemptedAt ?? null,
        page,
        pageSize,
      },
    ],
    queryFn: () =>
      authApi.getMyLoginHistory({
        succeeded: request.succeeded ?? null,
        fromAttemptedAt: request.fromAttemptedAt ?? null,
        toAttemptedAt: request.toAttemptedAt ?? null,
        page,
        pageSize,
      }),
    retry: false,
    staleTime: 30 * 1000,
  });
}