const ACCESS_TOKEN_KEY = "commercialnews_access_token";

function shouldRememberByDefault(): boolean {
  return localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ??
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  setAccessToken(
    accessToken: string,
    rememberMe = shouldRememberByDefault(),
  ): void {
    if (rememberMe) {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
