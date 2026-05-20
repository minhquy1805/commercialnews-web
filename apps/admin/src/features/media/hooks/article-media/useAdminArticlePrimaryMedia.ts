import { useQuery } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import { ADMIN_ARTICLE_MEDIA_QUERY_KEY } from './useAdminArticleMedia';

export function useAdminArticlePrimaryMedia(articleId: number) {
  return useQuery({
    queryKey: [
      ...ADMIN_ARTICLE_MEDIA_QUERY_KEY,
      articleId,
      'primary',
    ],
    queryFn: () => adminArticleMediaApi.getPrimary(articleId),
    enabled: Number.isFinite(articleId) && articleId > 0,
    retry: false,
  });
}