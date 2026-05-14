import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminCategory,
  AdminCategoryFilter,
  AdminCategoryListItem,
  CreateAdminCategoryRequest,
  CreateAdminCategoryResponse,
  RestoreAdminCategoryRequest,
  RestoreAdminCategoryResponse,
  SoftDeleteAdminCategoryRequest,
  SoftDeleteAdminCategoryResponse,
  UpdateAdminCategoryRequest,
  UpdateAdminCategoryResponse,
} from '../types/adminCategory.types';
import type { ContentPagedResponse } from '../types/contentPagination.types';

const BASE_URL = '/api/v1/admin/content/categories';

export const adminCategoriesApi = {
  getCategories: async (
    filter: AdminCategoryFilter,
  ): Promise<ContentPagedResponse<AdminCategoryListItem>> => {
    const response = await httpClient.get<
      ContentPagedResponse<AdminCategoryListItem>
    >(BASE_URL, {
      params: filter,
    });

    return response.data;
  },

  getCategoryById: async (categoryId: number): Promise<AdminCategory> => {
    const response = await httpClient.get<AdminCategory>(
      `${BASE_URL}/${categoryId}`,
    );

    return response.data;
  },

  createCategory: async (
    request: CreateAdminCategoryRequest,
  ): Promise<CreateAdminCategoryResponse> => {
    const response = await httpClient.post<CreateAdminCategoryResponse>(
      BASE_URL,
      request,
    );

    return response.data;
  },

  updateCategory: async (
    request: UpdateAdminCategoryRequest,
  ): Promise<UpdateAdminCategoryResponse> => {
    const { categoryId, ...body } = request;

    const response = await httpClient.put<UpdateAdminCategoryResponse>(
      `${BASE_URL}/${categoryId}`,
      body,
    );

    return response.data;
  },

  softDeleteCategory: async (
    request: SoftDeleteAdminCategoryRequest,
  ): Promise<SoftDeleteAdminCategoryResponse> => {
    const { categoryId, ...body } = request;

    const response = await httpClient.delete<SoftDeleteAdminCategoryResponse>(
      `${BASE_URL}/${categoryId}`,
      {
        data: body,
      },
    );

    return response.data;
  },

  restoreCategory: async (
    request: RestoreAdminCategoryRequest,
  ): Promise<RestoreAdminCategoryResponse> => {
    const { categoryId, ...body } = request;

    const response = await httpClient.post<RestoreAdminCategoryResponse>(
      `${BASE_URL}/${categoryId}:restore`,
      body,
    );

    return response.data;
  },
};