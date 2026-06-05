import type { FlatPagedResult } from '../../../shared/pagination';
import type { UserAccountStatus } from "../../../shared/types/userAccountStatus";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  publicId: string;
  email: string;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
};

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

export type UpdateMyAvatarRequest = {
  file: File;
};

export type UpdateMyAvatarResponse = {
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

export type GetMyLoginHistoryRequest = {
  succeeded?: boolean | null;
  fromAttemptedAt?: string | null;
  toAttemptedAt?: string | null;
  page?: number;
  pageSize?: number;
};

export type LoginHistoryItemResponse = {
  loginId: number | string;
  succeeded: boolean;
  failureReason: string | null;
  attemptedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string | null;
};

export type GetMyLoginHistoryResponse = FlatPagedResult<LoginHistoryItemResponse>;

export type LogoutResponse = {
  userId: number;
  loggedOut: boolean;
};

export type LogoutAllSessionsResponse = {
  userId: number;
  loggedOutAllSessions: boolean;
};
