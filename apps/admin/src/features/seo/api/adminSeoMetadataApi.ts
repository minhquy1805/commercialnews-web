import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminArticleSeoSettings,
  AdminSeoMetadataByResource,
  AdminSeoMetadataByResourceFilter,
  AdminSeoMetadataDetail,
  AdminSeoMetadataFilter,
  AdminSeoMetadataPagedResult,
  UpsertAdminArticleSeoSettingsRequest,
  UpsertAdminArticleSeoSettingsResponse,
} from "../types/adminSeoMetadata.types";

const BASE_URL = "/api/v1/admin/seo";

export const adminSeoMetadataApi = {
  getPaged: async (
    filter: AdminSeoMetadataFilter
  ): Promise<AdminSeoMetadataPagedResult> => {
    const response = await httpClient.get<AdminSeoMetadataPagedResult>(
      `${BASE_URL}/metadata`,
      {
        params: filter,
      }
    );

    return response.data;
  },

  getById: async (seoId: number): Promise<AdminSeoMetadataDetail> => {
    const response = await httpClient.get<AdminSeoMetadataDetail>(
      `${BASE_URL}/metadata/${seoId}`
    );

    return response.data;
  },

  getByResource: async (
    filter: AdminSeoMetadataByResourceFilter
  ): Promise<AdminSeoMetadataByResource> => {
    const response = await httpClient.get<AdminSeoMetadataByResource>(
      `${BASE_URL}/metadata/by-resource`,
      {
        params: filter,
      }
    );

    return response.data;
  },

  getArticleSettings: async (
    articlePublicId: string,
    scope?: string | null
  ): Promise<AdminArticleSeoSettings> => {
    const response = await httpClient.get<AdminArticleSeoSettings>(
      `${BASE_URL}/articles/${articlePublicId}`,
      {
        params: {
          scope,
        },
      }
    );

    return response.data;
  },

  upsertArticleSettings: async (
    articlePublicId: string,
    request: UpsertAdminArticleSeoSettingsRequest
  ): Promise<UpsertAdminArticleSeoSettingsResponse> => {
    const response =
      await httpClient.put<UpsertAdminArticleSeoSettingsResponse>(
        `${BASE_URL}/articles/${articlePublicId}`,
        request
      );

    return response.data;
  },
};