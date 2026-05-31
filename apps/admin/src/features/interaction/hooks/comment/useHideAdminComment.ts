import { useMutation } from '@tanstack/react-query';
import { adminCommentsApi } from '../../api/adminCommentsApi';
import type { HideAdminCommentRequest } from '../../types/adminComment.types';
import { useInvalidateAdminCommentsQueries } from './useAdminComments';

export type HideAdminCommentMutationRequest = HideAdminCommentRequest & {
  commentPublicId: string;
};

export function useHideAdminComment() {
  const invalidateAdminCommentsQueries = useInvalidateAdminCommentsQueries();

  return useMutation({
    mutationFn: (request: HideAdminCommentMutationRequest) => {
      const { commentPublicId, ...body } = request;

      return adminCommentsApi.hideComment(commentPublicId, body);
    },
    onSuccess: invalidateAdminCommentsQueries,
  });
}