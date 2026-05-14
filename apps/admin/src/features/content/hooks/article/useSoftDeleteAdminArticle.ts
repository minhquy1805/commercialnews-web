import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { SoftDeleteAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function useSoftDeleteAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: SoftDeleteAdminArticleRequest) =>
      adminArticlesApi.softDeleteArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}