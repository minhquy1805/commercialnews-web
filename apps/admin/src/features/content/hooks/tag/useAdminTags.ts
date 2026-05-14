import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import type { AdminTagFilter } from '../../types/adminTag.types';

export const ADMIN_TAGS_QUERY_KEY = ['admin', 'content', 'tags'] as const;

export function useInvalidateAdminTagsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_TAGS_QUERY_KEY,
    });
  };
}

export function useAdminTags(request: AdminTagFilter) {
  return useQuery({
    queryKey: [...ADMIN_TAGS_QUERY_KEY, request],
    queryFn: () => adminTagsApi.getTags(request),
    retry: false,
  });
}