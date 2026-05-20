import { useQuery } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import { ADMIN_MEDIA_ASSETS_QUERY_KEY } from './useAdminMediaAssets';

export function useAdminMediaAssetDetail(mediaId: number) {
  return useQuery({
    queryKey: [...ADMIN_MEDIA_ASSETS_QUERY_KEY, 'detail', mediaId],
    queryFn: () => adminMediaAssetsApi.getById(mediaId),
    enabled: Number.isFinite(mediaId) && mediaId > 0,
    retry: false,
  });
}