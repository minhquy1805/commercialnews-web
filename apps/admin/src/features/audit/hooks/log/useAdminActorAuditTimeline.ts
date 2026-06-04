import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '../../api/adminAuditLogsApi';
import type { GetAdminAuditTimelineRequest } from '../../types';
import { ADMIN_AUDIT_LOGS_QUERY_KEY } from './useAdminAuditLogs';

export function useAdminActorAuditTimeline(
  actorUserId?: string,
  request?: GetAdminAuditTimelineRequest,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_AUDIT_LOGS_QUERY_KEY,
      'actor-timeline',
      actorUserId,
      request,
    ],
    queryFn: () => adminAuditLogsApi.getActorTimeline(actorUserId!, request ?? {}),
    enabled: Boolean(actorUserId),
    retry: false,
  });
}