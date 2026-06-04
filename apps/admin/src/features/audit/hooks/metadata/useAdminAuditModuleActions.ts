import { useQuery } from '@tanstack/react-query';
import { adminAuditMetadataApi } from '../../api/adminAuditMetadataApi';
import { ADMIN_AUDIT_METADATA_QUERY_KEY } from './useAdminAuditModules';

export function useAdminAuditModuleActions(sourceModule?: string) {
  return useQuery({
    queryKey: [
      ...ADMIN_AUDIT_METADATA_QUERY_KEY,
      'modules',
      sourceModule,
      'actions',
    ],
    queryFn: () => adminAuditMetadataApi.getModuleActions(sourceModule!),
    enabled: Boolean(sourceModule),
    retry: false,
  });
}