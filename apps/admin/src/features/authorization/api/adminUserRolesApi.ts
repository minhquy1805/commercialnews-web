import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminAssignRoleToUserRequest,
  AdminAssignRoleToUserResponse,
  AdminRevokeRoleFromUserRequest,
  AdminRevokeRoleFromUserResponse,
  AdminUserEffectivePermissionsResponse,
  AdminUserRolesResponse,
} from "../types/adminUserRole.types";

const ADMIN_AUTHZ_USERS_BASE_URL = "/api/v1/admin/authz/users";

export const adminUserRolesApi = {
  async getUserRoles(userId: number): Promise<AdminUserRolesResponse> {
    const response = await httpClient.get<AdminUserRolesResponse>(
      `${ADMIN_AUTHZ_USERS_BASE_URL}/${userId}/roles`,
    );

    return response.data;
  },

  async getUserEffectivePermissions(
    userId: number,
  ): Promise<AdminUserEffectivePermissionsResponse> {
    const response = await httpClient.get<AdminUserEffectivePermissionsResponse>(
      `${ADMIN_AUTHZ_USERS_BASE_URL}/${userId}/effective-permissions`,
    );

    return response.data;
  },

  async assignRoleToUser(
    request: AdminAssignRoleToUserRequest,
  ): Promise<AdminAssignRoleToUserResponse> {
    const response = await httpClient.post<AdminAssignRoleToUserResponse>(
      `${ADMIN_AUTHZ_USERS_BASE_URL}/${request.userId}/roles`,
      {
        roleId: request.roleId,
      },
    );

    return response.data;
  },

  async revokeRoleFromUser(
    request: AdminRevokeRoleFromUserRequest,
  ): Promise<AdminRevokeRoleFromUserResponse> {
    const response = await httpClient.delete<AdminRevokeRoleFromUserResponse>(
      `${ADMIN_AUTHZ_USERS_BASE_URL}/${request.userId}/roles/${request.roleId}`,
    );

    return response.data;
  },
};
