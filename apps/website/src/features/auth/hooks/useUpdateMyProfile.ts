"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { UpdateMyProfileFormValues } from "../schemas/auth.schemas";

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateMyProfileFormValues) => {
      const normalizedFullName = values.fullName.trim();

      return authApi.updateMyProfile({
        fullName: normalizedFullName || null,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "current-user"],
      });
    },
  });
}