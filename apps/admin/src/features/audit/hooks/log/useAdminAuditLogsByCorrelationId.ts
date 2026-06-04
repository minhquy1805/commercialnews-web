import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import type { GetAdminAuditLogsByCorrelationIdRequest } from '../../types';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminAuditLogsByCorrelationId(
  correlationId?: string,
  request?: GetAdminAuditLogsByCorrelationIdRequest,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_AUDIT_LOGS_QUERY_KEY,
      'by-correlation',
      correlationId,
      request,
    ],
    queryFn: () =>
      adminAuditLogsApi.getLogsByCorrelationId(correlationId!, request),
    enabled: Boolean(correlationId),
    retry: false,
  });
}