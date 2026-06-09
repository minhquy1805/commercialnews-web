import type { CurrentUserResponse } from "../../types/auth.types";

type AccountInformationCardProps = {
  profile: CurrentUserResponse;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
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

export function AccountInformationCard({
  profile,
}: AccountInformationCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-950">
          Account information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Basic information about your account and activity.
        </p>
      </div>

      <dl className="divide-y divide-slate-100">
        <InfoRow label="Public ID" value={profile.publicId} />

        <InfoRow label="Email" value={profile.email} />

        <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
          <dt className="text-sm font-semibold text-slate-500">
            Email verified
          </dt>
          <dd className="sm:col-span-2">
            {profile.isEmailVerified ? (
              <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Verified
              </span>
            ) : (
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                Unverified
              </span>
            )}
          </dd>
        </div>

        <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
          <dt className="text-sm font-semibold text-slate-500">Status</dt>
          <dd className="sm:col-span-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClassName(
                profile.status,
              )}`}
            >
              {profile.status}
            </span>
          </dd>
        </div>

        <InfoRow label="Created at" value={formatDateTime(profile.createdAt)} />

        <InfoRow label="Updated at" value={formatDateTime(profile.updatedAt)} />

        <InfoRow
          label="Last login"
          value={formatDateTime(profile.lastLoginAt)}
        />
      </dl>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string | null;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="break-words text-sm font-medium text-slate-950 sm:col-span-2">
        {value || "N/A"}
      </dd>
    </div>
  );
}