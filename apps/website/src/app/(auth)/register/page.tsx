import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { PublicOnlyAuthGuard } from "@/features/auth/components/PublicOnlyAuthGuard";

export default function RegisterPage() {
  return (
    <PublicOnlyAuthGuard>
      <AuthCard
        title="Create account"
        description="Join Commercial News to save articles, like stories, and participate in discussions."
      >
        <RegisterForm />
      </AuthCard>
    </PublicOnlyAuthGuard>
  );
}