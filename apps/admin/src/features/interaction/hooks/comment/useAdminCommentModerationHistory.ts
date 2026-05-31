import { useQuery } from '@tanstack/react-query';
import { adminCommentsApi } from '../../api/adminCommentsApi';
import type { AdminCommentModerationHistoryFilter } from '../../types/adminComment.types';
import { ADMIN_COMMENTS_QUERY_KEY } from './useAdminComments';

export function useAdminCommentModerationHistory(
  commentPublicId: string | undefined,
  request: AdminCommentModerationHistoryFilter,
) {
  return useQuery({
    queryKey: [
      ...ADMIN_COMMENTS_QUERY_KEY,
      'detail',
      commentPublicId,
      'moderation-history',
      request,
    ],
    queryFn: () =>
      adminCommentsApi.getCommentModerationHistory(commentPublicId!, request),
    enabled: Boolean(commentPublicId),
    retry: false,
  });
}