import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuditDashboardApi } from '../../api/adminAuditDashboardApi';
import type { GetAdminAuditDashboardSummaryRequest } from '../../types';

export const ADMIN_AUDIT_DASHBOARD_QUERY_KEY = [
  'admin',
  'audit',
  'dashboard',
] as const;

export function useInvalidateAdminAuditDashboardQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_AUDIT_DASHBOARD_QUERY_KEY,
    });
  };
}

export function useAdminAuditDashboardSummary(
  request?: GetAdminAuditDashboardSummaryRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_DASHBOARD_QUERY_KEY, 'summary', request],
    queryFn: () => adminAuditDashboardApi.getDashboardSummary(request),
    retry: false,
  });
}