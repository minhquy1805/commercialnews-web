"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import type { RegisterFormValues } from "../schemas/auth.schemas";
import type { RegisterResponse } from "../types/auth.types";
import { getApiErrorDescription } from "@/shared/api/apiError";

export function useRegister() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] =
    useState<RegisterResponse | null>(null);

  const register = async (
    values: RegisterFormValues,
  ): Promise<RegisterResponse | null> => {
    setIsLoading(true);
    setErrorMessage(null);
    setRegisteredUser(null);

    try {
      const response = await authApi.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName?.trim() || null,
      });

      setRegisteredUser(response);

      router.push(`/verify-email?email=${encodeURIComponent(response.email)}`);

      return response;
    } catch (error) {
      const description = getApiErrorDescription(
        error,
        "Unable to create account. Please try again.",
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
    register,
    isLoading,
    errorMessage,
    registeredUser,
    clearError,
  };
}