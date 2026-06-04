import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import type { GetAdminAuditTimelineRequest } from '../../types';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminResourceAuditTimeline(
  resourceType?: string,
  resourceId?: string,
  request?: GetAdminAuditTimelineRequest,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_AUDIT_LOGS_QUERY_KEY,
      'resource-timeline',
      resourceType,
      resourceId,
      request,
    ],
    queryFn: () =>
      adminAuditLogsApi.getResourceTimeline(
        resourceType!,
        resourceId!,
        request ?? {},
      ),
    enabled: Boolean(resourceType && resourceId),
    retry: false,
  });
}