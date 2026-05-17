import { useQuery } from '@tanstack/react-query';
import { adminSlugRoutesApi } from '../../api/adminSlugRoutesApi';
import type { CheckSlugAvailabilityRequest } from '../../types/adminSlugRoute.types';
import { ADMIN_SLUG_ROUTES_QUERY_KEY } from './useAdminSlugRoutes';

export function useCheckSlugAvailability(
  request: CheckSlugAvailabilityRequest,
  enabled = true
) {
  return useQuery({
    queryKey: [...ADMIN_SLUG_ROUTES_QUERY_KEY, 'availability', request],
    queryFn: () => adminSlugRoutesApi.checkAvailability(request),
    enabled: enabled && Boolean(request.slug?.trim()),
    retry: false,
  });
}