import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { identityApi } from "../api/identityApi";

export function useMyProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["identity", "me"],
    queryFn: identityApi.getMyProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}