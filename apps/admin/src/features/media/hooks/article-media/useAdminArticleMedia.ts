import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import {
  ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE,
  ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE_SIZE,
  ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_BY,
  ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_DIRECTION,
} from '../../constants/mediaConstants';
import type { AdminArticleMediaListQuery } from '../../types/adminArticleMedia.types';

export const ADMIN_ARTICLE_MEDIA_QUERY_KEY = [
  'admin',
  'media',
  'article-media',
] as const;

export function useInvalidateAdminArticleMediaQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_ARTICLE_MEDIA_QUERY_KEY,
    });
  };
}

export function useAdminArticleMedia(
  articleId: number,
  request: AdminArticleMediaListQuery = {}
) {
  const normalizedRequest: AdminArticleMediaListQuery = {
    page: ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE,
    pageSize: ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE_SIZE,
    sortBy: ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_BY,
    sortDirection: ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_DIRECTION,
    ...request,
  };

  return useQuery({
    queryKey: [
      ...ADMIN_ARTICLE_MEDIA_QUERY_KEY,
      articleId,
      normalizedRequest,
    ],
    queryFn: () => adminArticleMediaApi.getList(articleId, normalizedRequest),
    enabled: Number.isFinite(articleId) && articleId > 0,
    retry: false,
  });
}