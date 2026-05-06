import { useMutation } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";
import type { ChangePasswordRequest } from "../types/identity.types";

export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) =>
      identityApi.changePassword(request),
  });
}