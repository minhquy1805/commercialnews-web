import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCommentsApi } from '../../api/adminCommentsApi';
import type { AdminCommentsFilter } from '../../types/adminComment.types';

export const ADMIN_COMMENTS_QUERY_KEY = [
  'admin',
  'interaction',
  'comments',
] as const;

export function useInvalidateAdminCommentsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_COMMENTS_QUERY_KEY,
    });
  };
}

export function useAdminComments(request: AdminCommentsFilter) {
  return useQuery({
    queryKey: [...ADMIN_COMMENTS_QUERY_KEY, request],
    queryFn: () => adminCommentsApi.getComments(request),
    retry: false,
  });
}