import { useMutation } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import type { UpdateMediaAssetRequest } from '../../types/adminMediaAsset.types';
import { useInvalidateAdminMediaAssetsQueries } from './useAdminMediaAssets';

type UpdateAdminMediaAssetMutationRequest = {
  mediaId: number;
  request: UpdateMediaAssetRequest;
};

export function useUpdateAdminMediaAsset() {
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: ({
      mediaId,
      request,
    }: UpdateAdminMediaAssetMutationRequest) =>
      adminMediaAssetsApi.update(mediaId, request),
    onSuccess: async () => {
      await invalidateAdminMediaAssetsQueries();
    },
  });
}