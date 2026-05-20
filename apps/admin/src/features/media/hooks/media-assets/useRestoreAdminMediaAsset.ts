import { useMutation } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import { useInvalidateAdminMediaAssetsQueries } from './useAdminMediaAssets';

export function useRestoreAdminMediaAsset() {
  const invalidateAdminMediaAssetsQueries =
    useInvalidateAdminMediaAssetsQueries();

  return useMutation({
    mutationFn: (mediaId: number) => adminMediaAssetsApi.restore(mediaId),
    onSuccess: async () => {
      await invalidateAdminMediaAssetsQueries();
    },
  });
}