import { useMutation } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import type { UpdateAdminTagRequest } from '../../types/adminTag.types';
import { useInvalidateAdminTagsQueries } from './useAdminTags';

export function useUpdateAdminTag() {
  const invalidateAdminTagsQueries = useInvalidateAdminTagsQueries();

  return useMutation({
    mutationFn: (request: UpdateAdminTagRequest) =>
      adminTagsApi.updateTag(request),
    onSuccess: invalidateAdminTagsQueries,
  });
}