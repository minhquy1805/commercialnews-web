"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import type { LoginFormValues } from "../schemas/auth.schemas";
import type { LoginResponse } from "../types/auth.types";
import { getApiErrorDescription } from "@/shared/api/apiError";
import { tokenStorage } from "@/shared/auth/tokenStorage";

export function useLogin() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<LoginResponse | null>(null);

  const login = async (values: LoginFormValues): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoggedInUser(null);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      tokenStorage.setAccessToken(response.accessToken);
      setLoggedInUser(response);

      router.push("/");

      return response;
    } catch (error) {
      const description = getApiErrorDescription(
        error,
        "Unable to sign in. Please try again.",
      );

      setErrorMessage(description);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    login,
    isLoading,
    errorMessage,
    loggedInUser,
    clearError,
  };
}