import { useQuery } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import { ADMIN_TAGS_QUERY_KEY } from './useAdminTags';

export function useAdminTagDetail(tagId: number) {
  return useQuery({
    queryKey: [...ADMIN_TAGS_QUERY_KEY, 'detail', tagId],
    queryFn: () => adminTagsApi.getTagById(tagId),
    enabled: Number.isFinite(tagId) && tagId > 0,
    retry: false,
  });
}