import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminArticleMediaListQuery,
  AdminArticleMediaListResponse,
  AdminArticleMediaSetState,
  AdminArticlePrimaryMediaResponse,
  AttachMediaToArticleRequest,
  AttachMediaToArticleResponse,
  DetachMediaFromArticleResponse,
  ReorderArticleMediaRequest,
  ReorderArticleMediaResponse,
  SetPrimaryMediaRequest,
  SetPrimaryMediaResponse,
} from '../types/adminArticleMedia.types';

const getBaseUrl = (articleId: number) =>
  `/api/v1/admin/media/articles/${articleId}`;

export const adminArticleMediaApi = {
  attach: async (
    articleId: number,
    request: AttachMediaToArticleRequest,
  ) => {
    const response = await httpClient.post<AttachMediaToArticleResponse>(
      `${getBaseUrl(articleId)}/attachments`,
      request,
    );

    return response.data;
  },

  detach: async (articleId: number, mediaId: number) => {
    const response = await httpClient.delete<DetachMediaFromArticleResponse>(
      `${getBaseUrl(articleId)}/attachments/${mediaId}`,
    );

    return response.data;
  },

  setPrimary: async (
    articleId: number,
    request: SetPrimaryMediaRequest,
  ) => {
    const response = await httpClient.post<SetPrimaryMediaResponse>(
      `${getBaseUrl(articleId)}/attachments:set-primary`,
      request,
    );

    return response.data;
  },

  reorder: async (
    articleId: number,
    request: ReorderArticleMediaRequest,
  ) => {
    const response = await httpClient.post<ReorderArticleMediaResponse>(
      `${getBaseUrl(articleId)}/attachments:reorder`,
      request,
    );

    return response.data;
  },

  getList: async (
    articleId: number,
    query: AdminArticleMediaListQuery = {},
  ) => {
    const response = await httpClient.get<AdminArticleMediaListResponse>(
      `${getBaseUrl(articleId)}/attachments`,
      {
        params: query,
      },
    );

    return response.data;
  },

  getPrimary: async (articleId: number) => {
    const response = await httpClient.get<AdminArticlePrimaryMediaResponse>(
      `${getBaseUrl(articleId)}/attachments/primary`,
    );

    return response.data;
  },

  getState: async (articleId: number) => {
    const response = await httpClient.get<AdminArticleMediaSetState>(
      `${getBaseUrl(articleId)}/attachments/state`,
    );

    return response.data;
  },
};