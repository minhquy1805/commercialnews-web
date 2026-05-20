import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminMediaAssetsApi } from '../../api/adminMediaAssetsApi';
import {
  ADMIN_MEDIA_DEFAULT_PAGE,
  ADMIN_MEDIA_DEFAULT_PAGE_SIZE,
  ADMIN_MEDIA_DEFAULT_SORT_BY,
  ADMIN_MEDIA_DEFAULT_SORT_DIRECTION,
} from '../../constants/mediaConstants';
import type { AdminMediaAssetsQuery } from '../../types/adminMediaAsset.types';

export const ADMIN_MEDIA_ASSETS_QUERY_KEY = [
  'admin',
  'media',
  'assets',
] as const;

export function useInvalidateAdminMediaAssetsQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_MEDIA_ASSETS_QUERY_KEY,
    });
  };
}

export function useAdminMediaAssets(request: AdminMediaAssetsQuery = {}) {
  const normalizedRequest: AdminMediaAssetsQuery = {
    page: ADMIN_MEDIA_DEFAULT_PAGE,
    pageSize: ADMIN_MEDIA_DEFAULT_PAGE_SIZE,
    sortBy: ADMIN_MEDIA_DEFAULT_SORT_BY,
    sortDirection: ADMIN_MEDIA_DEFAULT_SORT_DIRECTION,
    ...request,
  };

  return useQuery({
    queryKey: [...ADMIN_MEDIA_ASSETS_QUERY_KEY, normalizedRequest],
    queryFn: () => adminMediaAssetsApi.getList(normalizedRequest),
    retry: false,
  });
}