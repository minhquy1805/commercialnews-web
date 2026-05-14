import { useMutation } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import type { RestoreAdminCategoryRequest } from '../../types/adminCategory.types';
import { useInvalidateAdminCategoriesQueries } from './useAdminCategories';

export function useRestoreAdminCategory() {
  const invalidateAdminCategoriesQueries =
    useInvalidateAdminCategoriesQueries();

  return useMutation({
    mutationFn: (request: RestoreAdminCategoryRequest) =>
      adminCategoriesApi.restoreCategory(request),
    onSuccess: invalidateAdminCategoriesQueries,
  });
}