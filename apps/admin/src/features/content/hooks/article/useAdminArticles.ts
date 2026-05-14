import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { AdminArticleFilter } from '../../types/adminArticle.types';

export const ADMIN_ARTICLES_QUERY_KEY = [
  'admin',
  'content',
  'articles',
] as const;

export function useInvalidateAdminArticlesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_ARTICLES_QUERY_KEY,
    });
  };
}

export function useAdminArticles(request: AdminArticleFilter) {
  return useQuery({
    queryKey: [...ADMIN_ARTICLES_QUERY_KEY, request],
    queryFn: () => adminArticlesApi.getArticles(request),
    retry: false,
  });
}