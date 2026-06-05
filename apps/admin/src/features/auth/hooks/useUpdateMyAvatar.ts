import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { UpdateMyAvatarRequest } from "../types/auth.types";

export function useUpdateMyAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateMyAvatarRequest) =>
      authApi.updateMyAvatar(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
}
