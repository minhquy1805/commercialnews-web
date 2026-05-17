import { useQuery } from '@tanstack/react-query';
import { adminSeoMetadataApi } from '../../api/adminSeoMetadataApi';
import { ADMIN_SEO_METADATA_QUERY_KEY } from './useAdminSeoMetadata';

export function useAdminArticleSeoSettings(
  articlePublicId: string,
  scope?: string | null
) {
  return useQuery({
    queryKey: [
      ...ADMIN_SEO_METADATA_QUERY_KEY,
      'article-settings',
      articlePublicId,
      scope ?? null,
    ],
    queryFn: () =>
      adminSeoMetadataApi.getArticleSettings(articlePublicId, scope),
    enabled: Boolean(articlePublicId?.trim()),
    retry: false,
  });
}