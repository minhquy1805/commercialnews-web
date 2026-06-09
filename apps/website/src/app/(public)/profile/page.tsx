import { ProtectedAuthGuard } from "@/features/auth/components/ProtectedAuthGuard";
import { MyProfileContent } from "@/features/auth/components/MyProfileContent";

export default function ProfilePage() {
  return (
    <ProtectedAuthGuard>
      <MyProfileContent />
    </ProtectedAuthGuard>
  );
}