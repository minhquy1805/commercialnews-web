import type { ReactNode } from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <PublicHeader />

      <main className="flex-1">{children}</main>

      <PublicFooter />
    </div>
  );
}