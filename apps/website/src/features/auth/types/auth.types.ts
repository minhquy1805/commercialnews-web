import type { UserAccountStatus } from "../constants/userAccountStatuses";

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = {
  userId: number;
  publicId: string;
  email: string;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName?: string | null;
};

export type RegisterResponse = {
  userId: number;
  publicId: string;
  email: string;
  requiresEmailVerification: boolean;
};

export type VerifyEmailRequest = {
  token: string;
};

export type VerifyEmailResponse = {
  userId: number;
  verified: boolean;
};

export type ResendVerificationEmailRequest = {
  email: string;
};

export type ResendVerificationEmailResponse = {
  requested: boolean;
  message: string;
};

export type CurrentUserResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserAccountStatus;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
};

export type UpdateMyProfileRequest = {
  fullName?: string | null;
};

export type UpdateMyProfileResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserAccountStatus;
  updatedAt: string | null;
};

export type UpdateMyAvatarResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string | null;
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

export type LogoutResponse = {
  userId?: number;
  loggedOut: boolean;
};

export type LogoutAllSessionsResponse = {
  userId: number;
  loggedOutAllSessions: boolean;
};

export type GetMyLoginHistoryRequest = {
  succeeded?: boolean | null;
  fromAttemptedAt?: string | null;
  toAttemptedAt?: string | null;
  page?: number;
  pageSize?: number;
};

export type LoginHistoryItemResponse = {
  loginId: number;
  succeeded: boolean;
  failureReason: string | null;
  attemptedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string | null;
};

export type GetMyLoginHistoryResponse = {
  items: LoginHistoryItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  requested: boolean;
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  userId: number;
  passwordReset: boolean;
};