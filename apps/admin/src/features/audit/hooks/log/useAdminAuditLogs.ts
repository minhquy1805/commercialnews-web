import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import type { GetAdminAuditLogsRequest } from '../../types';

export const ADMIN_AUDIT_LOGS_QUERY_KEY = [
  'admin',
  'audit',
  'logs',
] as const;

export function useInvalidateAdminAuditLogsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_AUDIT_LOGS_QUERY_KEY,
    });
  };
}

export function useAdminAuditLogs(request: GetAdminAuditLogsRequest) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_LOGS_QUERY_KEY, request],
    queryFn: () => adminAuditLogsApi.getLogs(request),
    retry: false,
  });
}