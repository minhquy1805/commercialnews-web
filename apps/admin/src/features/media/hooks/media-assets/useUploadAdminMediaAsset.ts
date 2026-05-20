import { useMutation } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import type { UploadMediaAssetRequest } from '../../types/adminMediaAsset.types';
import { useInvalidateAdminMediaAssetsQueries } from './useAdminMediaAssets';

export function useUploadAdminMediaAsset() {
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: (request: UploadMediaAssetRequest) =>
      adminMediaAssetsApi.upload(request),
    onSuccess: async () => {
      await invalidateAdminMediaAssetsQueries();
    },
  });
}