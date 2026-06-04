import { httpClient } from '../../../shared/api/httpClient';
import type {
  GetAdminAuditModuleActionsResponse,
  GetAdminAuditModulesResponse,
} from '../types';

const BASE_URL = '/api/v1/admin/audit';

export const adminAuditMetadataApi = {
  getModules() {
    return httpClient.get<GetAdminAuditModulesResponse>(`${BASE_URL}/modules`);
  },

  getModuleActions(sourceModule: string) {
    return httpClient.get<GetAdminAuditModuleActionsResponse>(
      `${BASE_URL}/modules/${sourceModule}/actions`,
    );
  },
};