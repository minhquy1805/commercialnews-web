import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { LoginRequest } from "../types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
  });
}
