"use client";

import { Container } from "@/shared/components/ui/Container";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ProfileOverviewCard } from "./profile/ProfileOverviewCard";
import { AccountInformationCard } from "./profile/AccountInformationCard";
import { EditProfileForm } from "./profile/EditProfileForm";
import { ChangePasswordForm } from "./profile/ChangePasswordForm";
import { AvatarUploadCard } from "./profile/AvatarUploadCard";
import { LoginHistoryTable } from "./profile/LoginHistoryTable";
import { LogoutAllSessionsCard } from "./profile/LogoutAllSessionsCard";

export function MyProfileContent() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <Container>
        <section className="py-12 sm:py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading profile...
            </p>
          </div>
        </section>
      </Container>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Account
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              View your account information and manage your profile settings.
            </p>
          </div>

          <div className="space-y-6">
            <ProfileOverviewCard profile={currentUser} />
            <AccountInformationCard profile={currentUser} />
            <EditProfileForm profile={currentUser} />
            <AvatarUploadCard profile={currentUser} />
            <ChangePasswordForm />
            <LoginHistoryTable />
            <LogoutAllSessionsCard />
          </div>


        </div>
      </section>
    </Container>
  );
}