import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminAuditLogDetail(publicId?: string) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_LOGS_QUERY_KEY, 'detail', publicId],
    queryFn: () => adminAuditLogsApi.getLogByPublicId(publicId!),
    enabled: Boolean(publicId),
    retry: false,
  });
}