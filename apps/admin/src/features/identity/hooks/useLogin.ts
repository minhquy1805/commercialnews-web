import { useMutation } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";
import type { LoginRequest } from "../types/identity.types";

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => identityApi.login(request),
  });
}