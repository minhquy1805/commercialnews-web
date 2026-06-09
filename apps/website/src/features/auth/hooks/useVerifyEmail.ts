"use client";

import { useState } from "react";
import { authApi } from "../api/authApi";
import type { VerifyEmailResponse } from "../types/auth.types";
import { getApiErrorDescription } from "@/shared/api/apiError";

export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyEmailResponse | null>(null);

  const verifyEmail = async (
    token: string,
  ): Promise<VerifyEmailResponse | null> => {
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await authApi.verifyEmail({ token });

      setResult(response);

      return response;
    } catch (error) {
      const description = getApiErrorDescription(
        error,
        "Unable to verify your email. Please try again.",
      );

      setErrorMessage(description);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyEmail,
    isLoading,
    errorMessage,
    result,
  };
}