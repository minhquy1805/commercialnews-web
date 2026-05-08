import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminGrantPermissionToRoleRequest,
  AdminGrantPermissionToRoleResponse,
  AdminPermissionRolesResponse,
  AdminRevokePermissionFromRoleRequest,
  AdminRevokePermissionFromRoleResponse,
  AdminRolePermissionsResponse,
} from "../types/adminRolePermission.types";

const ADMIN_AUTHZ_BASE_URL = "/api/v1/admin/authz";

export const adminRolePermissionsApi = {
  async getRolePermissions(
    roleId: number,
  ): Promise<AdminRolePermissionsResponse> {
    const response = await httpClient.get<AdminRolePermissionsResponse>(
      `${ADMIN_AUTHZ_BASE_URL}/roles/${roleId}/permissions`,
    );

    return response.data;
  },

  async getPermissionRoles(
    permissionId: number,
  ): Promise<AdminPermissionRolesResponse> {
    const response = await httpClient.get<AdminPermissionRolesResponse>(
      `${ADMIN_AUTHZ_BASE_URL}/permissions/${permissionId}/roles`,
    );

    return response.data;
  },

  async grantPermissionToRole(
    request: AdminGrantPermissionToRoleRequest,
  ): Promise<AdminGrantPermissionToRoleResponse> {
    const response = await httpClient.post<AdminGrantPermissionToRoleResponse>(
      `${ADMIN_AUTHZ_BASE_URL}/roles/${request.roleId}/permissions`,
      {
        permissionId: request.permissionId,
      },
    );

    return response.data;
  },

  async revokePermissionFromRole(
    request: AdminRevokePermissionFromRoleRequest,
  ): Promise<AdminRevokePermissionFromRoleResponse> {
    const response =
      await httpClient.delete<AdminRevokePermissionFromRoleResponse>(
        `${ADMIN_AUTHZ_BASE_URL}/roles/${request.roleId}/permissions/${request.permissionId}`,
      );

    return response.data;
  },
};
