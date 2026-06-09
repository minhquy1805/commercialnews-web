"use client";

import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import type { ResendVerificationEmailResponse } from "../types/auth.types";
import { getApiErrorDescription } from "@/shared/api/apiError";

const DEFAULT_COOLDOWN_SECONDS = 60;

type UseResendVerificationEmailOptions = {
  cooldownSeconds?: number;
};

export function useResendVerificationEmail({
  cooldownSeconds = DEFAULT_COOLDOWN_SECONDS,
}: UseResendVerificationEmailOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] =
    useState<ResendVerificationEmailResponse | null>(null);

  const canResend = !isLoading && cooldownRemaining <= 0;

  useEffect(() => {
    if (cooldownRemaining <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setCooldownRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [cooldownRemaining]);

  const resendVerificationEmail = async (
    email: string,
  ): Promise<ResendVerificationEmailResponse | null> => {
    if (!canResend) {
      return null;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setResult(null);

    try {
      const response = await authApi.resendVerificationEmail({ email });

      setResult(response);
      setSuccessMessage(
        response.message || "Verification email has been sent again.",
      );
      setCooldownRemaining(cooldownSeconds);

      return response;
    } catch (error) {
      const description = getApiErrorDescription(
        error,
        "Unable to resend verification email. Please try again later.",
      );

      setErrorMessage(description);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return {
    resendVerificationEmail,
    isLoading,
    canResend,
    cooldownRemaining,
    errorMessage,
    successMessage,
    result,
    clearMessages,
  };
}