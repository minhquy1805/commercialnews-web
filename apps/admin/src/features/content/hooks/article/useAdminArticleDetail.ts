import { useQuery } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import { ADMIN_ARTICLES_QUERY_KEY } from './useAdminArticles';

export function useAdminArticleDetail(articleId: number) {
  return useQuery({
    queryKey: [...ADMIN_ARTICLES_QUERY_KEY, 'detail', articleId],
    queryFn: () => adminArticlesApi.getArticleById(articleId),
    enabled: Number.isFinite(articleId) && articleId > 0,
    retry: false,
  });
}