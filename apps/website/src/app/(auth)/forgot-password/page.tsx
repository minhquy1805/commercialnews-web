import { AuthCard } from "@/features/auth/components/AuthCard";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { PublicOnlyAuthGuard } from "@/features/auth/components/PublicOnlyAuthGuard";

export default function ForgotPasswordPage() {
  return (
    <PublicOnlyAuthGuard>
      <AuthCard
        title="Forgot password"
        description="Enter your email address and we will send you a password reset link."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </PublicOnlyAuthGuard>
  );
}