"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { ForgotPasswordFormValues } from "../schemas/auth.schemas";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordFormValues) =>
      authApi.forgotPassword({
        email: values.email,
      }),
  });
}