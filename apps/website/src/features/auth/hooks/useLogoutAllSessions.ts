"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import { tokenStorage } from "@/shared/auth/tokenStorage";

export function useLogoutAllSessions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAllSessions(),

    onSuccess: (response) => {
      if (!response.loggedOutAllSessions) {
        return;
      }

      tokenStorage.clearAccessToken();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      router.replace("/login");
    },
  });
}