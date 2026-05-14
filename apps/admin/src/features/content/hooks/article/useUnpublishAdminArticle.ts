import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { UnpublishAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function useUnpublishAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: UnpublishAdminArticleRequest) =>
      adminArticlesApi.unpublishArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}