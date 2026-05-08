import type { UserAccountStatus } from "../../../shared/types/userAccountStatus";

export type AdminUserListRequest = {
  fromCreatedAt?: string | null;
  toCreatedAt?: string | null;
  status?: string | null;
  isEmailVerified?: boolean | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
};

export type AdminUserListItemResponse = {
  userId: number;
  publicId: string;
  email: string;
  emailNormalized: string;
  fullName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  status: UserAccountStatus | string;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
  version: number;
};

export type AdminUserListResponse = {
  items: AdminUserListItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type AdminUserDetailResponse = AdminUserListItemResponse;

export type AdminUserSessionItemResponse = {
  refreshTokenId: number | string;
  userId: number;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  createdIp: string | null;
  userAgent: string | null;
  correlationId: string | null;
  isRevoked: boolean;
  isExpired: boolean;
  isActive: boolean;
};

export type AdminUserSessionListResponse = {
  userId: number;
  items: AdminUserSessionItemResponse[];
};

export type AdminUserLoginHistoryRequest = {
  userId: number;
  succeeded?: boolean | null;
  fromAttemptedAt?: string | null;
  toAttemptedAt?: string | null;
  page?: number;
  pageSize?: number;
};

export type AdminUserLoginHistoryItemResponse = {
  loginId: number | string;
  userId: number;
  succeeded: boolean;
  failureReason: string | null;
  attemptedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string | null;
};

export type AdminUserLoginHistoryResponse = {
  userId: number;
  items: AdminUserLoginHistoryItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type AdminUserSecuritySummaryResponse = {
  userId: number;
  publicId: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  status: UserAccountStatus | string;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  totalSessionCount: number;
  activeSessionCount: number;
  revokedSessionCount: number;
  expiredSessionCount: number;
  loginSuccessCount: number;
  loginFailureCount: number;
  failedLoginCountLast7Days: number;
  recentFailedLoginAt: string | null;
  lastPasswordResetRequestedAt: string | null;
  passwordResetTokenCount: number;
  activePasswordResetTokenCount: number;
};

export type AdminUserActionReasonRequest = {
  userId: number;
  reason?: string | null;
};

export type AdminDisableUserRequest = AdminUserActionReasonRequest & {
  revokeSessions: boolean;
};

export type AdminLockUserRequest = AdminUserActionReasonRequest & {
  lockedUntilUtc: string;
  revokeSessions: boolean;
};

export type AdminActivateUserResponse = {
  userId: number;
  publicId: string;
  email: string;
  status: UserAccountStatus | string;
  activated: boolean;
  activatedAtUtc: string | null;
};

export type AdminDisableUserResponse = {
  userId: number;
  publicId: string;
  email: string;
  status: UserAccountStatus | string;
  disabled: boolean;
  sessionsRevoked: boolean;
  revokedSessionCount: number;
  disabledAtUtc: string | null;
};

export type AdminLockUserResponse = {
  userId: number;
  publicId: string;
  email: string;
  status: UserAccountStatus | string;
  lockedUntilUtc: string | null;
  locked: boolean;
  sessionsRevoked: boolean;
  revokedSessionCount: number;
  lockedAtUtc: string | null;
};

export type AdminUnlockUserResponse = {
  userId: number;
  publicId: string;
  email: string;
  status: UserAccountStatus | string;
  unlocked: boolean;
  unlockedAtUtc: string | null;
};

export type AdminMarkEmailVerifiedResponse = {
  userId: number;
  publicId: string;
  email: string;
  isEmailVerified: boolean;
  wasAlreadyVerified: boolean;
  status: UserAccountStatus | string;
  markedVerifiedAtUtc: string | null;
};

export type AdminRevokeUserSessionsResponse = {
  userId: number;
  publicId: string;
  email: string;
  revokedSessionCount: number;
  revokedAtUtc: string | null;
};
