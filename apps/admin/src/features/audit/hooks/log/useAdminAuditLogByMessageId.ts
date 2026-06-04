import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminAuditLogByMessageId(messageId?: string) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_LOGS_QUERY_KEY, 'by-message', messageId],
    queryFn: () => adminAuditLogsApi.getLogByMessageId(messageId!),
    enabled: Boolean(messageId),
    retry: false,
  });
}