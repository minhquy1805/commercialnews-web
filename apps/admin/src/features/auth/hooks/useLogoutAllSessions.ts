import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useLogoutAllSessions() {
  return useMutation({
    mutationFn: authApi.logoutAllSessions,
  });
}
