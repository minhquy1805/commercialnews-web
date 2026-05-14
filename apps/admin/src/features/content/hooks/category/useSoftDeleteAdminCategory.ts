import { useMutation } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import type { SoftDeleteAdminCategoryRequest } from '../../types/adminCategory.types';
import { useInvalidateAdminCategoriesQueries } from './useAdminCategories';

export function useSoftDeleteAdminCategory() {
  const invalidateAdminCategoriesQueries =
    useInvalidateAdminCategoriesQueries();

  return useMutation({
    mutationFn: (request: SoftDeleteAdminCategoryRequest) =>
      adminCategoriesApi.softDeleteCategory(request),
    onSuccess: invalidateAdminCategoriesQueries,
  });
}