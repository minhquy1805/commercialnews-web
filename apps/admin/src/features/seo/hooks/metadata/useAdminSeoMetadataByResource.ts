import { useQuery } from '@tanstack/react-query';
import { adminSeoMetadataApi } from '../../api/adminSeoMetadataApi';
import type { AdminSeoMetadataByResourceFilter } from '../../types/adminSeoMetadata.types';
import { ADMIN_SEO_METADATA_QUERY_KEY } from './useAdminSeoMetadata';

export function useAdminSeoMetadataByResource(
  request: AdminSeoMetadataByResourceFilter
) {
  return useQuery({
    queryKey: [...ADMIN_SEO_METADATA_QUERY_KEY, 'by-resource', request],
    queryFn: () => adminSeoMetadataApi.getByResource(request),
    enabled:
      Boolean(request.resourceType) &&
      Boolean(request.resourcePublicId?.trim()),
    retry: false,
  });
}