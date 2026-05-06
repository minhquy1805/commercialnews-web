import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";
import type { UpdateMyProfileRequest } from "../types/identity.types";

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateMyProfileRequest) =>
      identityApi.updateMyProfile(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["identity", "me"],
      });
    },
  });
}