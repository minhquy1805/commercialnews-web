import { useQuery } from '@tanstack/react-query';
import { adminCategoriesApi } from '../../api/adminCategoriesApi';
import { ADMIN_CATEGORIES_QUERY_KEY } from './useAdminCategories';

export function useAdminCategoryDetail(categoryId: number) {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, 'detail', categoryId],
    queryFn: () => adminCategoriesApi.getCategoryById(categoryId),
    enabled: Number.isFinite(categoryId) && categoryId > 0,
    retry: false,
  });
}