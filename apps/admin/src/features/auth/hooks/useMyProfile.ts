import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../api/authApi";

export function useMyProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMyProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
