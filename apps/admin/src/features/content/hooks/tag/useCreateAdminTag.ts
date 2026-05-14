import { useMutation } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import type { CreateAdminTagRequest } from '../../types/adminTag.types';
import { useInvalidateAdminTagsQueries } from './useAdminTags';

export function useCreateAdminTag() {
  const invalidateAdminTagsQueries = useInvalidateAdminTagsQueries();

  return useMutation({
    mutationFn: (request: CreateAdminTagRequest) =>
      adminTagsApi.createTag(request),
    onSuccess: invalidateAdminTagsQueries,
  });
}