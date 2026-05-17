import { useQuery } from '@tanstack/react-query';
import { adminSlugRoutesApi } from '../../api/adminSlugRoutesApi';
import type { AdminSlugRouteByResourceFilter } from '../../types/adminSlugRoute.types';
import { ADMIN_SLUG_ROUTES_QUERY_KEY } from './useAdminSlugRoutes';

export function useAdminSlugRouteByResource(
  request: AdminSlugRouteByResourceFilter
) {
  return useQuery({
    queryKey: [...ADMIN_SLUG_ROUTES_QUERY_KEY, 'by-resource', request],
    queryFn: () => adminSlugRoutesApi.getByResource(request),
    enabled:
      Boolean(request.resourceType) &&
      Boolean(request.resourcePublicId?.trim()),
    retry: false,
  });
}