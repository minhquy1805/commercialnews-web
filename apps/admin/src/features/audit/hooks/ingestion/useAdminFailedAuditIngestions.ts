import { useQuery } from '@tanstack/react-query';
import { adminAuditIngestionsApi } from '../../api/adminAuditIngestionsApi';
import type { GetFailedAdminAuditIngestionListRequest } from '../../types';
import { ADMIN_AUDIT_INGESTIONS_QUERY_KEY } from './useAdminAuditIngestions';

export function useAdminFailedAuditIngestions(
  request: GetFailedAdminAuditIngestionListRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_INGESTIONS_QUERY_KEY, 'failed', request],
    queryFn: () => adminAuditIngestionsApi.getFailedIngestions(request),
    retry: false,
  });
}