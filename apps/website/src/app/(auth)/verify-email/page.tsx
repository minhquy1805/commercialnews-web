import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { VerifyEmailContent } from "@/features/auth/components/VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Email verification">
      <Suspense
        fallback={
          <p className="text-center text-sm font-medium text-slate-500">
            Verifying email...
          </p>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}
