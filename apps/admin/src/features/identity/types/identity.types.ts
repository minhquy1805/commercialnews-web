export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  publicId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
};

export const USER_ACCOUNT_STATUSES = {
  UNVERIFIED: "Unverified",
  ACTIVE: "Active",
  LOCKED: "Locked",
  DISABLED: "Disabled",
} as const;

export type UserAccountStatus =
  (typeof USER_ACCOUNT_STATUSES)[keyof typeof USER_ACCOUNT_STATUSES];

export type MyProfileResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserAccountStatus;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
};

export type UpdateMyProfileRequest = {
  fullName: string;
  avatarUrl: string | null;
};

export type UpdateMyProfileResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserAccountStatus;
  updatedAt: string | null;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  userId: number;
  passwordChanged: boolean;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  userId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type LogoutResponse = {
  userId: number;
  loggedOut: boolean;
};

export type LogoutAllSessionsResponse = {
  userId: number;
  loggedOutAllSessions: boolean;
};