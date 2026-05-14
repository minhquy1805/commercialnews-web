import { useMutation } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import type { UpdateAdminCategoryRequest } from '../../types/adminCategory.types';
import { useInvalidateAdminCategoriesQueries } from './useAdminCategories';

export function useUpdateAdminCategory() {
  const invalidateAdminCategoriesQueries =
    useInvalidateAdminCategoriesQueries();

  return useMutation({
    mutationFn: (request: UpdateAdminCategoryRequest) =>
      adminCategoriesApi.updateCategory(request),
    onSuccess: invalidateAdminCategoriesQueries,
  });
}