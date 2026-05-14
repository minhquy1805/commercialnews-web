import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { PublishAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function usePublishAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: PublishAdminArticleRequest) =>
      adminArticlesApi.publishArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}