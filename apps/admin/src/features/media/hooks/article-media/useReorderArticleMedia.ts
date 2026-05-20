import { useMutation } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import type { ReorderArticleMediaRequest } from '../../types/adminArticleMedia.types';
import { useInvalidateAdminArticleMediaQueries } from './useAdminArticleMedia';

type ReorderArticleMediaMutationRequest = {
  articleId: number;
  request: ReorderArticleMediaRequest;
};

export function useReorderArticleMedia() {
  const invalidateAdminArticleMediaQueries =
    useInvalidateAdminArticleMediaQueries();

  return useMutation({
    mutationFn: ({
      articleId,
      request,
    }: ReorderArticleMediaMutationRequest) =>
      adminArticleMediaApi.reorder(articleId, request),
    onSuccess: async () => {
      await invalidateAdminArticleMediaQueries();
    },
  });
}