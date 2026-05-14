import { useQuery } from '@tanstack/react-query';
import { adminArticlesApi } from '../../api/adminArticlesApi';
import { ADMIN_ARTICLES_QUERY_KEY } from './useAdminArticles';

export function useAdminArticleRevisionDetail(
  articleId: number,
  revisionId: number,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_ARTICLES_QUERY_KEY,
      'detail',
      articleId,
      'revisions',
      revisionId,
    ],
    queryFn: () =>
      adminArticlesApi.getArticleRevisionById(articleId, revisionId),
    enabled:
      Number.isFinite(articleId) &&
      articleId > 0 &&
      Number.isFinite(revisionId) &&
      revisionId > 0,
    retry: false,
  });
}