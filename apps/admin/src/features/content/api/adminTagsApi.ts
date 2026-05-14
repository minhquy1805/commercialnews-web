import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminTag,
  AdminTagFilter,
  AdminTagListItem,
  CreateAdminTagRequest,
  CreateAdminTagResponse,
  RestoreAdminTagRequest,
  RestoreAdminTagResponse,
  SoftDeleteAdminTagRequest,
  SoftDeleteAdminTagResponse,
  UpdateAdminTagRequest,
  UpdateAdminTagResponse,
} from '../types/adminTag.types';
import type { ContentPagedResponse } from '../types/contentPagination.types';

const BASE_URL = '/api/v1/admin/content/tags';

export const adminTagsApi = {
  getTags: async (
    filter: AdminTagFilter,
  ): Promise<ContentPagedResponse<AdminTagListItem>> => {
    const response = await httpClient.get<ContentPagedResponse<AdminTagListItem>>(
      BASE_URL,
      {
        params: filter,
      },
    );

    return response.data;
  },

  getTagById: async (tagId: number): Promise<AdminTag> => {
    const response = await httpClient.get<AdminTag>(`${BASE_URL}/${tagId}`);

    return response.data;
  },

  createTag: async (
    request: CreateAdminTagRequest,
  ): Promise<CreateAdminTagResponse> => {
    const response = await httpClient.post<CreateAdminTagResponse>(
      BASE_URL,
      request,
    );

    return response.data;
  },

  updateTag: async (
    request: UpdateAdminTagRequest,
  ): Promise<UpdateAdminTagResponse> => {
    const { tagId, ...body } = request;

    const response = await httpClient.put<UpdateAdminTagResponse>(
      `${BASE_URL}/${tagId}`,
      body,
    );

    return response.data;
  },

  softDeleteTag: async (
    request: SoftDeleteAdminTagRequest,
  ): Promise<SoftDeleteAdminTagResponse> => {
    const { tagId, ...body } = request;

    const response = await httpClient.delete<SoftDeleteAdminTagResponse>(
      `${BASE_URL}/${tagId}`,
      {
        data: body,
      },
    );

    return response.data;
  },

  restoreTag: async (
    request: RestoreAdminTagRequest,
  ): Promise<RestoreAdminTagResponse> => {
    const { tagId, ...body } = request;

    const response = await httpClient.post<RestoreAdminTagResponse>(
      `${BASE_URL}/${tagId}:restore`,
      body,
    );

    return response.data;
  },
};