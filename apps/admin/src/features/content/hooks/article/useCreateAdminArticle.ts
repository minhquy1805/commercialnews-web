import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { CreateAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function useCreateAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: CreateAdminArticleRequest) =>
      adminArticlesApi.createArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}