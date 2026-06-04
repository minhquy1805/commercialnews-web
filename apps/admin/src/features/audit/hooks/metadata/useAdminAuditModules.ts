import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuditMetadataApi } from '../../api/adminAuditMetadataApi';

export const ADMIN_AUDIT_METADATA_QUERY_KEY = [
  'admin',
  'audit',
  'metadata',
] as const;

export function useInvalidateAdminAuditMetadataQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_AUDIT_METADATA_QUERY_KEY,
    });
  };
}

export function useAdminAuditModules() {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_METADATA_QUERY_KEY, 'modules'],
    queryFn: () => adminAuditMetadataApi.getModules(),
    retry: false,
  });
}