import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { UpdateAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function useUpdateAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: UpdateAdminArticleRequest) =>
      adminArticlesApi.updateArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}