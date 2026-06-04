import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminAuditDashboardSummary,
  AdminRecentRiskEvents,
  GetAdminAuditDashboardSummaryRequest,
  GetAdminRecentRiskEventsRequest,
} from '../types';

const BASE_URL = '/api/v1/admin/audit/dashboard';

export const adminAuditDashboardApi = {
  getDashboardSummary(params?: GetAdminAuditDashboardSummaryRequest) {
    return httpClient.get<AdminAuditDashboardSummary>(`${BASE_URL}/summary`, {
      params,
    });
  },

  getRecentRiskEvents(params?: GetAdminRecentRiskEventsRequest) {
    return httpClient.get<AdminRecentRiskEvents>(
      `${BASE_URL}/recent-risk-events`,
      {
        params,
      },
    );
  },
};