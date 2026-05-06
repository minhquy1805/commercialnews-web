import type { ReactNode } from "react";

type AdminContentProps = {
  children: ReactNode;
  background: string;
  borderRadius: number;
};

export function AdminContent({
  children,
  background,
  borderRadius,
}: AdminContentProps) {
  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background,
        borderRadius,
      }}
    >
      {children}
    </div>
  );
}