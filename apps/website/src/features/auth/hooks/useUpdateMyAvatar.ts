"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import {
  updateMyAvatarSchema,
  type UpdateMyAvatarFormValues,
} from "../schemas/auth.schemas";

export function useUpdateMyAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateMyAvatarFormValues) => {
      const parsed = updateMyAvatarSchema.parse(values);

      return authApi.updateMyAvatar(parsed.file);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "current-user"],
      });
    },
  });
}