import { create } from "zustand";
import { tokenStorage } from "../../../shared/auth/tokenStorage";

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => {
  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();

  return {
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken),

    setTokens: (newAccessToken, newRefreshToken) => {
      tokenStorage.setTokens(newAccessToken, newRefreshToken);

      set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
      });
    },

    clearAuth: () => {
      tokenStorage.clearTokens();

      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },
  };
});