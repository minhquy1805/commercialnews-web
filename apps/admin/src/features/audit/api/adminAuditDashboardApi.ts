import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminAuditDashboardSummary,
  AdminRecentRiskEvents,
  GetAdminAuditDashboardSummaryRequest,
  GetAdminRecentRiskEventsRequest,
} from '../types';

const BASE_URL = '/api/v1/admin/audit/dashboard';

export const adminAuditDashboardApi = {
  async getDashboardSummary(params?: GetAdminAuditDashboardSummaryRequest) {
    const response = await httpClient.get<AdminAuditDashboardSummary>(
      `${BASE_URL}/summary`,
      { params },
    );

    return response.data;
  },

  async getRecentRiskEvents(params?: GetAdminRecentRiskEventsRequest) {
    const response = await httpClient.get<AdminRecentRiskEvents>(
      `${BASE_URL}/recent-risk-events`,
      { params },
    );

    return response.data;
  },
};