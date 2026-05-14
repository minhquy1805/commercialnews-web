import { useMutation } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import type { ArchiveAdminArticleRequest } from '../../types/adminArticle.types';
import { useInvalidateAdminArticlesQueries } from './useAdminArticles';

export function useArchiveAdminArticle() {
  const invalidateAdminArticlesQueries = useInvalidateAdminArticlesQueries();

  return useMutation({
    mutationFn: (request: ArchiveAdminArticleRequest) =>
      adminArticlesApi.archiveArticle(request),
    onSuccess: invalidateAdminArticlesQueries,
  });
}