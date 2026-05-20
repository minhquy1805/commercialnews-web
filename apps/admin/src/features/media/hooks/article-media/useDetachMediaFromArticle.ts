import { useMutation } from '@tanstack/react-query';
import { adminArticleMediaApi } from '../../api/adminArticleMediaApi';
import { useInvalidateAdminMediaAssetsQueries } from '../media-assets/useAdminMediaAssets';
import { useInvalidateAdminArticleMediaQueries } from './useAdminArticleMedia';

type DetachMediaFromArticleMutationRequest = {
  articleId: number;
  mediaId: number;
};

export function useDetachMediaFromArticle() {
  const invalidateAdminArticleMediaQueries =
    useInvalidateAdminArticleMediaQueries();
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: ({
      articleId,
      mediaId,
    }: DetachMediaFromArticleMutationRequest) =>
      adminArticleMediaApi.detach(articleId, mediaId),
    onSuccess: async () => {
      await Promise.all([
        invalidateAdminArticleMediaQueries(),
        invalidateAdminMediaAssetsQueries(),
      ]);
    },
  });
}