import { useQuery } from '@tanstack/react-query';
import { adminCommentsApi } from '../../api/adminCommentsApi';
import { ADMIN_COMMENTS_QUERY_KEY } from './useAdminComments';

export function useAdminCommentDetail(commentPublicId?: string) {
  return useQuery({
    queryKey: [...ADMIN_COMMENTS_QUERY_KEY, 'detail', commentPublicId],
    queryFn: () => adminCommentsApi.getCommentByPublicId(commentPublicId!),
    enabled: Boolean(commentPublicId),
    retry: false,
  });
}