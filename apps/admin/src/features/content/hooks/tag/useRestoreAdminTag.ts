import { useMutation } from '@tanstack/react-query';
import { adminTagsApi } from '../../api/adminTagsApi';
import type { RestoreAdminTagRequest } from '../../types/adminTag.types';
import { useInvalidateAdminTagsQueries } from './useAdminTags';

export function useRestoreAdminTag() {
  const invalidateAdminTagsQueries = useInvalidateAdminTagsQueries();

  return useMutation({
    mutationFn: (request: RestoreAdminTagRequest) =>
      adminTagsApi.restoreTag(request),
    onSuccess: invalidateAdminTagsQueries,
  });
}