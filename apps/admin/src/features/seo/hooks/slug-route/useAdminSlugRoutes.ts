import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSlugRoutesApi } from '../../api/adminSlugRoutesApi';
import { SEO_DEFAULTS } from '../../constants/seoConstants';
import type { AdminSlugRouteFilter } from '../../types/adminSlugRoute.types';

export const ADMIN_SLUG_ROUTES_QUERY_KEY = [
  'admin',
  'seo',
  'slug-routes',
] as const;

export function useInvalidateAdminSlugRoutesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_SLUG_ROUTES_QUERY_KEY,
    });
  };
}

export function useAdminSlugRoutes(request: AdminSlugRouteFilter) {
  const normalizedRequest: AdminSlugRouteFilter = {
    page: SEO_DEFAULTS.PAGE,
    pageSize: SEO_DEFAULTS.PAGE_SIZE,
    sortBy: SEO_DEFAULTS.SORT_BY,
    sortDirection: SEO_DEFAULTS.SORT_DIRECTION,
    ...request,
  };

  return useQuery({
    queryKey: [...ADMIN_SLUG_ROUTES_QUERY_KEY, normalizedRequest],
    queryFn: () => adminSlugRoutesApi.getPaged(normalizedRequest),
    retry: false,
  });
}