import { useMutation } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import type { SoftDeleteMediaAssetRequest } from '../../types/adminMediaAsset.types';
import { useInvalidateAdminMediaAssetsQueries } from './useAdminMediaAssets';

type SoftDeleteAdminMediaAssetMutationRequest = {
  mediaId: number;
  request?: SoftDeleteMediaAssetRequest;
};

export function useSoftDeleteAdminMediaAsset() {
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: ({
      mediaId,
      request = {},
    }: SoftDeleteAdminMediaAssetMutationRequest) =>
      adminMediaAssetsApi.softDelete(mediaId, request),
    onSuccess: async () => {
      await invalidateAdminMediaAssetsQueries();
    },
  });
}