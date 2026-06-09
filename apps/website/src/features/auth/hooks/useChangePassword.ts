"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { ChangePasswordFormValues } from "../schemas/auth.schemas";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (values: ChangePasswordFormValues) => {
      return authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });
}