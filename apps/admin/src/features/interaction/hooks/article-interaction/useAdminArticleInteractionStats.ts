import { useQuery } from '@tanstack/react-query';
import { adminArticleInteractionStatsApi } from '../../api/adminArticleInteractionStatsApi';

export const ADMIN_ARTICLE_INTERACTION_STATS_QUERY_KEY = [
  'admin',
  'interaction',
  'article-stats',
] as const;

export function useAdminArticleInteractionStats(articlePublicId?: string) {
  return useQuery({
    queryKey: [
      ...ADMIN_ARTICLE_INTERACTION_STATS_QUERY_KEY,
      'detail',
      articlePublicId,
    ],
    queryFn: () =>
      adminArticleInteractionStatsApi.getArticleInteractionStats(
        articlePublicId!,
      ),
    enabled: Boolean(articlePublicId),
    retry: false,
  });
}