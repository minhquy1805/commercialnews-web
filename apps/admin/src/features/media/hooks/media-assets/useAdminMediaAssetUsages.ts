import { useQuery } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import { ADMIN_MEDIA_ASSETS_QUERY_KEY } from './useAdminMediaAssets';

export function useAdminMediaAssetUsages(
  mediaId: number,
  includeDeleted = false
) {
  return useQuery({
    queryKey: [
      ...ADMIN_MEDIA_ASSETS_QUERY_KEY,
      'usages',
      mediaId,
      includeDeleted,
    ],
    queryFn: () => adminMediaAssetsApi.getUsages(mediaId, includeDeleted),
    enabled: Number.isFinite(mediaId) && mediaId > 0,
    retry: false,
  });
}