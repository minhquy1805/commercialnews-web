import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { PublicOnlyAuthGuard } from "@/features/auth/components/PublicOnlyAuthGuard";

export default function LoginPage() {
  return (
    <PublicOnlyAuthGuard>
      <AuthCard
        title="Sign in"
        description="Welcome back to Commercial News. Continue reading, liking, and joining discussions."
      >
        <LoginForm />
      </AuthCard>
    </PublicOnlyAuthGuard>
  );
}