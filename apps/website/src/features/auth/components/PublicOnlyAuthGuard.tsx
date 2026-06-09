"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/shared/auth/tokenStorage";

type PublicOnlyAuthGuardProps = {
  children: React.ReactNode;
};

function subscribeToAuthStore() {
  return () => {};
}

function getAuthSnapshot() {
  return Boolean(tokenStorage.getAccessToken());
}

function getServerSnapshot() {
  return false;
}

export function PublicOnlyAuthGuard({ children }: PublicOnlyAuthGuardProps) {
  const router = useRouter();

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}