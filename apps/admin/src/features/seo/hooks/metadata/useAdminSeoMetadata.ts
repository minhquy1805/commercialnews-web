import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSeoMetadataApi } from '../../api/adminSeoMetadataApi';
import { SEO_DEFAULTS } from '../../constants/seoConstants';
import type { AdminSeoMetadataFilter } from '../../types/adminSeoMetadata.types';

export const ADMIN_SEO_METADATA_QUERY_KEY = [
  'admin',
  'seo',
  'metadata',
] as const;

export function useInvalidateAdminSeoMetadataQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_SEO_METADATA_QUERY_KEY,
    });
  };
}

export function useAdminSeoMetadata(request: AdminSeoMetadataFilter) {
  const normalizedRequest: AdminSeoMetadataFilter = {
    page: SEO_DEFAULTS.PAGE,
    pageSize: SEO_DEFAULTS.PAGE_SIZE,
    sortBy: SEO_DEFAULTS.SORT_BY,
    sortDirection: SEO_DEFAULTS.SORT_DIRECTION,
    ...request,
  };

  return useQuery({
    queryKey: [...ADMIN_SEO_METADATA_QUERY_KEY, normalizedRequest],
    queryFn: () => adminSeoMetadataApi.getPaged(normalizedRequest),
    retry: false,
  });
}