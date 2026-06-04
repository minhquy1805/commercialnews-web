import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuditIngestionsApi } from '../../api/adminAuditIngestionsApi';
import type { GetAdminAuditIngestionListRequest } from '../../types';

export const ADMIN_AUDIT_INGESTIONS_QUERY_KEY = [
  'admin',
  'audit',
  'ingestions',
] as const;

export function useInvalidateAdminAuditIngestionsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_AUDIT_INGESTIONS_QUERY_KEY,
    });
  };
}

export function useAdminAuditIngestions(
  request: GetAdminAuditIngestionListRequest,
) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_INGESTIONS_QUERY_KEY, request],
    queryFn: () => adminAuditIngestionsApi.getIngestions(request),
    retry: false,
  });
}