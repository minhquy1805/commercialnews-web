"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { ResetPasswordFormValues } from "../schemas/auth.schemas";

export function useResetPassword() {
  return useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authApi.resetPassword({
        token: values.token,
        newPassword: values.newPassword,
      }),
  });
}