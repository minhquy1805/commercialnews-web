import { useQuery } from '@tanstack/react-query';
import { adminAuditIngestionsApi } from '../../api/adminAuditIngestionsApi';
import { ADMIN_AUDIT_INGESTIONS_QUERY_KEY } from './useAdminAuditIngestions';

export function useAdminAuditIngestionByMessageId(messageId?: string) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_INGESTIONS_QUERY_KEY, 'by-message', messageId],
    queryFn: () => adminAuditIngestionsApi.getIngestionByMessageId(messageId!),
    enabled: Boolean(messageId),
    retry: false,
  });
}