import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import type { AdminCategoryFilter } from '../../types/adminCategory.types';

export const ADMIN_CATEGORIES_QUERY_KEY = [
  'admin',
  'content',
  'categories',
] as const;

export function useInvalidateAdminCategoriesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    });
  };
}

export function useAdminCategories(request: AdminCategoryFilter) {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, request],
    queryFn: () => adminCategoriesApi.getCategories(request),
    retry: false,
  });
}