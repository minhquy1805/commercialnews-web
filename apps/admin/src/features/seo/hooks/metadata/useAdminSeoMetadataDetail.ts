import { useQuery } from '@tanstack/react-query';
import { adminSeoMetadataApi } from '../../api/adminSeoMetadataApi';
import { ADMIN_SEO_METADATA_QUERY_KEY } from './useAdminSeoMetadata';

export function useAdminSeoMetadataDetail(seoId: number) {
  return useQuery({
    queryKey: [...ADMIN_SEO_METADATA_QUERY_KEY, 'detail', seoId],
    queryFn: () => adminSeoMetadataApi.getById(seoId),
    enabled: Number.isFinite(seoId) && seoId > 0,
    retry: false,
  });
}