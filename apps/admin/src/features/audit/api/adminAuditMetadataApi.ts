import { httpClient } from '../../../shared/api/httpClient';
import type {
  GetAdminAuditModuleActionsResponse,
  GetAdminAuditModulesResponse,
} from '../types';

const BASE_URL = '/api/v1/admin/audit';

export const adminAuditMetadataApi = {
  async getModules() {
    const response = await httpClient.get<GetAdminAuditModulesResponse>(
      `${BASE_URL}/modules`,
    );

    return response.data;
  },

  async getModuleActions(sourceModule: string) {
    const response = await httpClient.get<GetAdminAuditModuleActionsResponse>(
      `${BASE_URL}/modules/${encodeURIComponent(sourceModule)}/actions`,
    );

    return response.data;
  },
};