import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import type { GetAdminAuditLogsRequest } from '../../types';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminModuleAuditLogs(
  sourceModule?: string,
  request?: GetAdminAuditLogsRequest,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_AUDIT_LOGS_QUERY_KEY,
      'module',
      sourceModule,
      request,
    ],
    queryFn: () => adminAuditLogsApi.getModuleLogs(sourceModule!, request ?? {}),
    enabled: Boolean(sourceModule),
    retry: false,
  });
}