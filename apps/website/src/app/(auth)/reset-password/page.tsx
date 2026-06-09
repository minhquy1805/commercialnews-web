import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="Create a new password for your Commercial News account."
    >
      <Suspense
        fallback={
          <p className="text-sm font-medium text-slate-500">
            Loading reset form...
          </p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
