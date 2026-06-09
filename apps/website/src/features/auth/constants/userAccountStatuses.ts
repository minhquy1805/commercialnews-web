export const USER_ACCOUNT_STATUSES = {
  UNVERIFIED: "Unverified",
  ACTIVE: "Active",
  LOCKED: "Locked",
  DISABLED: "Disabled",
} as const;

export type UserAccountStatus =
  (typeof USER_ACCOUNT_STATUSES)[keyof typeof USER_ACCOUNT_STATUSES];