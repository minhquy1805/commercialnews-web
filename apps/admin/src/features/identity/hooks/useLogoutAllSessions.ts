import { useMutation } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";

export function useLogoutAllSessions() {
  return useMutation({
    mutationFn: identityApi.logoutAllSessions,
  });
}