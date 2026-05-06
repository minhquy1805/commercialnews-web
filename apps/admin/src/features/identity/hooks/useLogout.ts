import { useMutation } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";
import type { LogoutRequest } from "../types/identity.types";

export function useLogout() {
  return useMutation({
    mutationFn: (request: LogoutRequest) => identityApi.logout(request),
  });
}