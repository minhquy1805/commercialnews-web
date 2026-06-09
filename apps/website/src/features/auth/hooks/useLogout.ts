"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { getApiErrorDescription } from "@/shared/api/apiError";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authApi.logout();
    } catch (error) {
      const description = getApiErrorDescription(
        error,
        "Unable to sign out. Please try again.",
      );

      setErrorMessage(description);
    } finally {
      tokenStorage.clearAccessToken();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      setIsLoading(false);
      router.replace("/");
    }
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    logout,
    isLoading,
    errorMessage,
    clearError,
  };
}