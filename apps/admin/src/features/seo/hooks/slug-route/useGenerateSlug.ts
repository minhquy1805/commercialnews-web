import { useMutation } from '@tanstack/react-query';
import { adminSlugRoutesApi } from '../../api/adminSlugRoutesApi';
import type { GenerateSlugRequest } from '../../types/adminSlugRoute.types';
import { useInvalidateAdminSlugRoutesQueries } from './useAdminSlugRoutes';

export function useGenerateSlug() {
  const invalidateAdminSlugRoutesQueries =
    useInvalidateAdminSlugRoutesQueries();

  return useMutation({
    mutationFn: (request: GenerateSlugRequest) =>
      adminSlugRoutesApi.generateSlug(request),
    onSuccess: invalidateAdminSlugRoutesQueries,
  });
}