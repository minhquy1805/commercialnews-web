import { useQuery } from '@tanstack/react-query';
import { adminAuditDashboardApi } from '../../api/adminAuditDashboardApi';
import type { GetAdminRecentRiskEventsRequest } from '../../types';
import { ADMIN_AUDIT_DASHBOARD_QUERY_KEY } from './useAdminAuditDashboardSummary';

export function useAdminRecentRiskEvents(
  request?: GetAdminRecentRiskEventsRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_DASHBOARD_QUERY_KEY, 'recent-risk-events', request],
    queryFn: () => adminAuditDashboardApi.getRecentRiskEvents(request),
    retry: false,
  });
}