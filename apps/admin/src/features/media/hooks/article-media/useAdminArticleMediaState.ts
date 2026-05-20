import { useQuery } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import { ADMIN_ARTICLE_MEDIA_QUERY_KEY } from './useAdminArticleMedia';

export function useAdminArticleMediaState(articleId: number) {
  return useQuery({
    queryKey: [
      ...ADMIN_ARTICLE_MEDIA_QUERY_KEY,
      articleId,
      'state',
    ],
    queryFn: () => adminArticleMediaApi.getState(articleId),
    enabled: Number.isFinite(articleId) && articleId > 0,
    retry: false,
  });
}