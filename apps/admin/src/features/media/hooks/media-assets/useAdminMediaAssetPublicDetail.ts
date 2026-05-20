import { useQuery } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import { ADMIN_MEDIA_ASSETS_QUERY_KEY } from './useAdminMediaAssets';

export function useAdminMediaAssetPublicDetail(publicId: string) {
  return useQuery({
    queryKey: [
      ...ADMIN_MEDIA_ASSETS_QUERY_KEY,
      'public-detail',
      publicId,
    ],
    queryFn: () => adminMediaAssetsApi.getByPublicId(publicId),
    enabled: Boolean(publicId?.trim()),
    retry: false,
  });
}