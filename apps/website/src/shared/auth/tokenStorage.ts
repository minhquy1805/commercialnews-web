const ACCESS_TOKEN_KEY = "commercialnews.accessToken";
const AUTH_TOKEN_CHANGED_EVENT = "commercialnews.authTokenChanged";

function dispatchAuthTokenChangedEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(accessToken: string): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    dispatchAuthTokenChangedEvent();
  },

  clearAccessToken(): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatchAuthTokenChangedEvent();
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  },
};