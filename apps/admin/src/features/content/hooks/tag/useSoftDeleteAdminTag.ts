import { useMutation } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import type { SoftDeleteAdminTagRequest } from '../../types/adminTag.types';
import { useInvalidateAdminTagsQueries } from './useAdminTags';

export function useSoftDeleteAdminTag() {
  const invalidateAdminTagsQueries = useInvalidateAdminTagsQueries();

  return useMutation({
    mutationFn: (request: SoftDeleteAdminTagRequest) =>
      adminTagsApi.softDeleteTag(request),
    onSuccess: invalidateAdminTagsQueries,
  });
}