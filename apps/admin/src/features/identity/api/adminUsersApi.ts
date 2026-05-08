import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminActivateUserResponse,
  AdminDisableUserRequest,
  AdminDisableUserResponse,
  AdminLockUserRequest,
  AdminLockUserResponse,
  AdminMarkEmailVerifiedResponse,
  AdminRevokeUserSessionsResponse,
  AdminUnlockUserResponse,
  AdminUserActionReasonRequest,
  AdminUserDetailResponse,
  AdminUserListRequest,
  AdminUserListResponse,
  AdminUserLoginHistoryRequest,
  AdminUserLoginHistoryResponse,
  AdminUserSecuritySummaryResponse,
  AdminUserSessionListResponse,
} from "../types/adminUser.types";

const ADMIN_USERS_BASE_URL = "/api/v1/admin/identity/users";

export const adminUsersApi = {
  async listUsers(
    request: AdminUserListRequest = {},
  ): Promise<AdminUserListResponse> {
    const response = await httpClient.get<AdminUserListResponse>(
      ADMIN_USERS_BASE_URL,
      {
        params: request,
      },
    );

    return response.data;
  },

  async getUserDetail(userId: number): Promise<AdminUserDetailResponse> {
    const response = await httpClient.get<AdminUserDetailResponse>(
      `${ADMIN_USERS_BASE_URL}/${userId}`,
    );

    return response.data;
  },

  async getUserSessions(userId: number): Promise<AdminUserSessionListResponse> {
    const response = await httpClient.get<AdminUserSessionListResponse>(
      `${ADMIN_USERS_BASE_URL}/${userId}/sessions`,
    );

    return response.data;
  },

  async getUserLoginHistory(
    request: AdminUserLoginHistoryRequest,
  ): Promise<AdminUserLoginHistoryResponse> {
    const { userId, ...params } = request;
    const response = await httpClient.get<AdminUserLoginHistoryResponse>(
      `${ADMIN_USERS_BASE_URL}/${userId}/login-history`,
      {
        params,
      },
    );

    return response.data;
  },

  async getUserSecuritySummary(
    userId: number,
  ): Promise<AdminUserSecuritySummaryResponse> {
    const response = await httpClient.get<AdminUserSecuritySummaryResponse>(
      `${ADMIN_USERS_BASE_URL}/${userId}/security-summary`,
    );

    return response.data;
  },

  async activateUser(
    request: AdminUserActionReasonRequest,
  ): Promise<AdminActivateUserResponse> {
    const response = await httpClient.post<AdminActivateUserResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:activate`,
      getReasonBody(request.reason),
    );

    return response.data;
  },

  async disableUser(
    request: AdminDisableUserRequest,
  ): Promise<AdminDisableUserResponse> {
    const response = await httpClient.post<AdminDisableUserResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:disable`,
      {
        reason: request.reason?.trim() || null,
        revokeSessions: request.revokeSessions,
      },
    );

    return response.data;
  },

  async lockUser(request: AdminLockUserRequest): Promise<AdminLockUserResponse> {
    const response = await httpClient.post<AdminLockUserResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:lock`,
      {
        lockedUntilUtc: request.lockedUntilUtc,
        reason: request.reason?.trim() || null,
        revokeSessions: request.revokeSessions,
      },
    );

    return response.data;
  },

  async unlockUser(
    request: AdminUserActionReasonRequest,
  ): Promise<AdminUnlockUserResponse> {
    const response = await httpClient.post<AdminUnlockUserResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:unlock`,
      getReasonBody(request.reason),
    );

    return response.data;
  },

  async markEmailVerified(
    request: AdminUserActionReasonRequest,
  ): Promise<AdminMarkEmailVerifiedResponse> {
    const response = await httpClient.post<AdminMarkEmailVerifiedResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:mark-email-verified`,
      getReasonBody(request.reason),
    );

    return response.data;
  },

  async revokeUserSessions(
    request: AdminUserActionReasonRequest,
  ): Promise<AdminRevokeUserSessionsResponse> {
    const response = await httpClient.post<AdminRevokeUserSessionsResponse>(
      `${ADMIN_USERS_BASE_URL}/${request.userId}:revoke-sessions`,
      getReasonBody(request.reason),
    );

    return response.data;
  },
};

function getReasonBody(reason?: string | null) {
  const trimmedReason = reason?.trim();

  return trimmedReason ? { reason: trimmedReason } : undefined;
}
