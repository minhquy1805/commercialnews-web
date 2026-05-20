import { httpClient } from '../../../shared/api/httpClient';
import { ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES } from '../constants/mediaConstants';
import type {
  AdminMediaAsset,
  AdminMediaAssetsQuery,
  AdminMediaAssetsResponse,
  AdminMediaAssetUsagesResponse,
  CreateMediaAssetRequest,
  SoftDeleteMediaAssetRequest,
  UpdateMediaAssetRequest,
  UploadMediaAssetRequest,
} from '../types/adminMediaAsset.types';

const BASE_URL = '/api/v1/admin/media/items';

export const adminMediaAssetsApi = {
  create: async (request: CreateMediaAssetRequest) => {
    const response = await httpClient.post<AdminMediaAsset>(BASE_URL, request);

    return response.data;
  },

  getList: async (query: AdminMediaAssetsQuery = {}) => {
    const response = await httpClient.get<AdminMediaAssetsResponse>(BASE_URL, {
      params: query,
    });

    return response.data;
  },

  getById: async (mediaId: number) => {
    const response = await httpClient.get<AdminMediaAsset>(
      `${BASE_URL}/${mediaId}`,
    );

    return response.data;
  },

  getByPublicId: async (publicId: string) => {
    const response = await httpClient.get<AdminMediaAsset>(
      `${BASE_URL}/public/${publicId}`,
    );

    return response.data;
  },

  update: async (
    mediaId: number,
    request: UpdateMediaAssetRequest,
  ) => {
    const response = await httpClient.patch<AdminMediaAsset>(
      `${BASE_URL}/${mediaId}`,
      request,
    );

    return response.data;
  },

  softDelete: async (
    mediaId: number,
    request: SoftDeleteMediaAssetRequest = {},
  ) => {
    const response = await httpClient.delete<void>(`${BASE_URL}/${mediaId}`, {
      data: request,
    });

    return response.data;
  },

  restore: async (mediaId: number) => {
    const response = await httpClient.post<AdminMediaAsset>(
      `${BASE_URL}/${mediaId}:restore`,
    );

    return response.data;
  },

  getUsages: async (mediaId: number, includeDeleted = false) => {
    const response = await httpClient.get<AdminMediaAssetUsagesResponse>(
      `${BASE_URL}/${mediaId}/usages`,
      {
        params: {
          includeDeleted,
        },
      },
    );

    return response.data;
  },

  upload: async (request: UploadMediaAssetRequest) => {
    const formData = new FormData();

    formData.append(
      ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES.FILE,
      request.file,
    );

    formData.append(
      ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES.MEDIA_TYPE,
      request.mediaType,
    );

    if (request.altText) {
      formData.append(
        ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES.ALT_TEXT,
        request.altText,
      );
    }

    if (request.metadataJson) {
      formData.append(
        ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES.METADATA_JSON,
        request.metadataJson,
      );
    }

    if (request.folder) {
      formData.append(
        ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES.FOLDER,
        request.folder,
      );
    }

    const response = await httpClient.post<AdminMediaAsset>(
      `${BASE_URL}:upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};