import { useMutation } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import type { CreateAdminCategoryRequest } from '../../types/adminCategory.types';
import { useInvalidateAdminCategoriesQueries } from './useAdminCategories';

export function useCreateAdminCategory() {
  const invalidateAdminCategoriesQueries =
    useInvalidateAdminCategoriesQueries();

  return useMutation({
    mutationFn: (request: CreateAdminCategoryRequest) =>
      adminCategoriesApi.createCategory(request),
    onSuccess: invalidateAdminCategoriesQueries,
  });
}