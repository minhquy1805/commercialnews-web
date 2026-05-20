import { useMutation } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import type { CreateMediaAssetRequest } from '../../types/adminMediaAsset.types';
import { useInvalidateAdminMediaAssetsQueries } from './useAdminMediaAssets';

export function useCreateAdminMediaAsset() {
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: (request: CreateMediaAssetRequest) =>
      adminMediaAssetsApi.create(request),
    onSuccess: async () => {
      await invalidateAdminMediaAssetsQueries();
    },
  });
}