import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminActivatePermissionResponse,
  AdminCreatePermissionRequest,
  AdminCreatePermissionResponse,
  AdminDeactivatePermissionResponse,
  AdminPermissionActionRequest,
  AdminPermissionListRequest,
  AdminPermissionListResponse,
  AdminUpdatePermissionRequest,
  AdminUpdatePermissionResponse,
} from "../types/adminPermission.types";

const ADMIN_PERMISSIONS_BASE_URL = "/api/v1/admin/authz/permissions";

export const adminPermissionsApi = {
  async getPermissions(
    request: AdminPermissionListRequest = {},
  ): Promise<AdminPermissionListResponse> {
    const response = await httpClient.get<AdminPermissionListResponse>(
      ADMIN_PERMISSIONS_BASE_URL,
      {
        params: request,
      },
    );

    return response.data;
  },

  async createPermission(
    request: AdminCreatePermissionRequest,
  ): Promise<AdminCreatePermissionResponse> {
    const response = await httpClient.post<AdminCreatePermissionResponse>(
      ADMIN_PERMISSIONS_BASE_URL,
      normalizeCreatePermissionRequest(request),
    );

    return response.data;
  },

  async updatePermission(
    request: AdminUpdatePermissionRequest,
  ): Promise<AdminUpdatePermissionResponse> {
    const { permissionId, ...body } = request;
    const response = await httpClient.put<AdminUpdatePermissionResponse>(
      `${ADMIN_PERMISSIONS_BASE_URL}/${permissionId}`,
      normalizeUpdatePermissionRequest(body),
    );

    return response.data;
  },

  async activatePermission(
    request: AdminPermissionActionRequest,
  ): Promise<AdminActivatePermissionResponse> {
    const response = await httpClient.post<AdminActivatePermissionResponse>(
      `${ADMIN_PERMISSIONS_BASE_URL}/${request.permissionId}:activate`,
    );

    return response.data;
  },

  async deactivatePermission(
    request: AdminPermissionActionRequest,
  ): Promise<AdminDeactivatePermissionResponse> {
    const response = await httpClient.post<AdminDeactivatePermissionResponse>(
      `${ADMIN_PERMISSIONS_BASE_URL}/${request.permissionId}:deactivate`,
    );

    return response.data;
  },
};

function normalizeCreatePermissionRequest(request: AdminCreatePermissionRequest) {
  return {
    key: request.key.trim(),
    module: request.module.trim(),
    action: request.action.trim(),
    description: request.description?.trim() || null,
    isSystem: request.isSystem,
  };
}

function normalizeUpdatePermissionRequest(
  request: Omit<AdminUpdatePermissionRequest, "permissionId">,
) {
  return {
    key: request.key.trim(),
    module: request.module.trim(),
    action: request.action.trim(),
    description: request.description?.trim() || null,
  };
}
