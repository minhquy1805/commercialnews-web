import { useQuery } from '@tanstack/react-query';
import { adminAuditIngestionsApi } from '../../api/adminAuditIngestionsApi';
import { ADMIN_AUDIT_INGESTIONS_QUERY_KEY } from './useAdminAuditIngestions';

export function useAdminAuditIngestionDetail(publicId?: string) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_INGESTIONS_QUERY_KEY, 'detail', publicId],
    queryFn: () => adminAuditIngestionsApi.getIngestionByPublicId(publicId!),
    enabled: Boolean(publicId),
    retry: false,
  });
}