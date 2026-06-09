import type { CurrentUserResponse } from "../../types/auth.types";
import Image from "next/image";

type ProfileOverviewCardProps = {
  profile: CurrentUserResponse;
};

function getDisplayName(profile: CurrentUserResponse) {
  return profile.fullName?.trim() || profile.email;
}

function getAvatarInitial(displayName: string) {
  return displayName.charAt(0).toUpperCase();
}

function getStatusBadgeClassName(status: CurrentUserResponse["status"]) {
  switch (status) {
    case "Active":
      return "border-green-200 bg-green-50 text-green-700";
    case "Unverified":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Locked":
      return "border-red-200 bg-red-50 text-red-700";
    case "Disabled":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  const displayName = getDisplayName(profile);
  const avatarInitial = getAvatarInitial(displayName);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {profile.avatarUrl ? (
                <Image
                    src={profile.avatarUrl}
                    alt={displayName}
                    width={80}
                    height={80}
                    className="size-20 rounded-full object-cover ring-4 ring-white/20"
                />
                ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-950 ring-4 ring-white/20">
                    {avatarInitial}
                </div>
            )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold tracking-tight">
              {displayName}
            </h2>

            <p className="mt-1 truncate text-sm text-slate-300">
              {profile.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClassName(
                  profile.status,
                )}`}
              >
                {profile.status}
              </span>

              {profile.isEmailVerified ? (
                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Email verified
                </span>
              ) : (
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Email unverified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-5 sm:grid-cols-3 sm:px-8">
        <OverviewItem label="Full name" value={profile.fullName || "N/A"} />
        <OverviewItem label="Email" value={profile.email} />
        <OverviewItem label="Account status" value={profile.status} />
      </div>
    </section>
  );
}

type OverviewItemProps = {
  label: string;
  value: string;
};

function OverviewItem({ label, value }: OverviewItemProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}