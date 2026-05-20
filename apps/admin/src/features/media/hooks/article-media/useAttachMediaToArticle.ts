import { useMutation } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import type { AttachMediaToArticleRequest } from '../../types/adminArticleMedia.types';
import { useInvalidateAdminMediaAssetsQueries } from '../media-assets/useAdminMediaAssets';
import { useInvalidateAdminArticleMediaQueries } from './useAdminArticleMedia';

type AttachMediaToArticleMutationRequest = {
  articleId: number;
  request: AttachMediaToArticleRequest;
};

export function useAttachMediaToArticle() {
  const invalidateAdminArticleMediaQueries =
    useInvalidateAdminArticleMediaQueries();
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: ({
      articleId,
      request,
    }: AttachMediaToArticleMutationRequest) =>
      adminArticleMediaApi.attach(articleId, request),
    onSuccess: async () => {
      await Promise.all([
        invalidateAdminArticleMediaQueries(),
        invalidateAdminMediaAssetsQueries(),
      ]);
    },
  });
}