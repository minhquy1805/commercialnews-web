import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminActivateRoleResponse,
  AdminCreateRoleRequest,
  AdminCreateRoleResponse,
  AdminDeactivateRoleResponse,
  AdminRoleActionRequest,
  AdminRoleListRequest,
  AdminRoleListResponse,
  AdminUpdateRoleRequest,
  AdminUpdateRoleResponse,
} from "../types/adminRole.types";

const ADMIN_ROLES_BASE_URL = "/api/v1/admin/authz/roles";

export const adminRolesApi = {
  async getRoles(
    request: AdminRoleListRequest = {},
  ): Promise<AdminRoleListResponse> {
    const response = await httpClient.get<AdminRoleListResponse>(
      ADMIN_ROLES_BASE_URL,
      {
        params: request,
      },
    );

    return response.data;
  },

  async createRole(
    request: AdminCreateRoleRequest,
  ): Promise<AdminCreateRoleResponse> {
    const response = await httpClient.post<AdminCreateRoleResponse>(
      ADMIN_ROLES_BASE_URL,
      normalizeCreateRoleRequest(request),
    );

    return response.data;
  },

  async updateRole(
    request: AdminUpdateRoleRequest,
  ): Promise<AdminUpdateRoleResponse> {
    const { roleId, ...body } = request;
    const response = await httpClient.put<AdminUpdateRoleResponse>(
      `${ADMIN_ROLES_BASE_URL}/${roleId}`,
      normalizeUpdateRoleRequest(body),
    );

    return response.data;
  },

  async activateRole(
    request: AdminRoleActionRequest,
  ): Promise<AdminActivateRoleResponse> {
    const response = await httpClient.post<AdminActivateRoleResponse>(
      `${ADMIN_ROLES_BASE_URL}/${request.roleId}:activate`,
    );

    return response.data;
  },

  async deactivateRole(
    request: AdminRoleActionRequest,
  ): Promise<AdminDeactivateRoleResponse> {
    const response = await httpClient.post<AdminDeactivateRoleResponse>(
      `${ADMIN_ROLES_BASE_URL}/${request.roleId}:deactivate`,
    );

    return response.data;
  },
};

function normalizeCreateRoleRequest(request: AdminCreateRoleRequest) {
  return {
    name: request.name.trim(),
    displayName: request.displayName.trim(),
    description: request.description?.trim() || null,
    isSystem: request.isSystem,
  };
}

function normalizeUpdateRoleRequest(
  request: Omit<AdminUpdateRoleRequest, "roleId">,
) {
  return {
    name: request.name.trim(),
    displayName: request.displayName.trim(),
    description: request.description?.trim() || null,
  };
}
