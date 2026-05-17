import { useQuery } from '@tanstack/react-query';
import { adminSlugRoutesApi } from '../../api/adminSlugRoutesApi';
import { ADMIN_SLUG_ROUTES_QUERY_KEY } from './useAdminSlugRoutes';

export function useAdminSlugRouteDetail(slugId: number) {
  return useQuery({
    queryKey: [...ADMIN_SLUG_ROUTES_QUERY_KEY, 'detail', slugId],
    queryFn: () => adminSlugRoutesApi.getById(slugId),
    enabled: Number.isFinite(slugId) && slugId > 0,
    retry: false,
  });
}