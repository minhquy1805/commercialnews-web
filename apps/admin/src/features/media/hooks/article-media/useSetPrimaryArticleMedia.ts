import { useMutation } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import type { SetPrimaryMediaRequest } from '../../types/adminArticleMedia.types';
import { useInvalidateAdminArticleMediaQueries } from './useAdminArticleMedia';

type SetPrimaryArticleMediaMutationRequest = {
  articleId: number;
  request: SetPrimaryMediaRequest;
};

export function useSetPrimaryArticleMedia() {
  const invalidateAdminArticleMediaQueries =
    useInvalidateAdminArticleMediaQueries();

  return useMutation({
    mutationFn: ({
      articleId,
      request,
    }: SetPrimaryArticleMediaMutationRequest) =>
      adminArticleMediaApi.setPrimary(articleId, request),
    onSuccess: async () => {
      await invalidateAdminArticleMediaQueries();
    },
  });
}