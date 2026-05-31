import { useMutation } from '@tanstack/react-query';
import { adminCommentsApi } from '../../api/adminCommentsApi';
import type { RestoreAdminCommentRequest } from '../../types/adminComment.types';
import { useInvalidateAdminCommentsQueries } from './useAdminComments';

export type RestoreAdminCommentMutationRequest = RestoreAdminCommentRequest & {
  commentPublicId: string;
};

export function useRestoreAdminComment() {
  const invalidateAdminCommentsQueries = useInvalidateAdminCommentsQueries();

  return useMutation({
    mutationFn: (request: RestoreAdminCommentMutationRequest) => {
      const { commentPublicId, ...body } = request;

      return adminCommentsApi.restoreComment(commentPublicId, body);
    },
    onSuccess: invalidateAdminCommentsQueries,
  });
}