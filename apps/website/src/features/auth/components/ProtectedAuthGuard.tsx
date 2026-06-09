"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/shared/auth/tokenStorage";

type ProtectedAuthGuardProps = {
  children: React.ReactNode;
};

function getAuthSnapshot() {
  return Boolean(tokenStorage.getAccessToken());
}

function getServerSnapshot() {
  return false;
}

export function ProtectedAuthGuard({ children }: ProtectedAuthGuardProps) {
  const router = useRouter();

  const isAuthenticated = useSyncExternalStore(
    tokenStorage.subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}