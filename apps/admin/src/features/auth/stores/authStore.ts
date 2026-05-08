import { create } from "zustand";
import { tokenStorage } from "../../../shared/auth/tokenStorage";

type AuthStore = {
  accessToken: string | null;
  isAuthenticated: boolean;

  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => {
  const accessToken = tokenStorage.getAccessToken();

  return {
    accessToken,
    isAuthenticated: Boolean(accessToken),

    setAccessToken: (newAccessToken) => {
      tokenStorage.setAccessToken(newAccessToken);

      set({
        accessToken: newAccessToken,
        isAuthenticated: true,
      });
    },

    clearAuth: () => {
      tokenStorage.clearTokens();

      set({
        accessToken: null,
        isAuthenticated: false,
      });
    },
  };
});
