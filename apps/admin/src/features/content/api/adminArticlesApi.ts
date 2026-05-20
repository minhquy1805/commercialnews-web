import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminArticle,
  AdminArticleFilter,
  AdminArticleLifecycleEventItem,
  AdminArticleListItem,
  AdminArticleRevisionDetail,
  AdminArticleRevisionListItem,
  AdminArticleTagItem,
  ArchiveAdminArticleRequest,
  ArchiveAdminArticleResponse,
  CreateAdminArticleRequest,
  CreateAdminArticleResponse,
  PublishAdminArticleRequest,
  PublishAdminArticleResponse,
  SoftDeleteAdminArticleRequest,
  SoftDeleteAdminArticleResponse,
  UnpublishAdminArticleRequest,
  UnpublishAdminArticleResponse,
  UpdateAdminArticleRequest,
  UpdateAdminArticleResponse,
} from '../types/adminArticle.types';
import type { ContentPagedResponse } from '../types/contentPagination.types';

const BASE_URL = '/api/v1/admin/content/articles';

export const adminArticlesApi = {
  getArticles: async (
    filter: AdminArticleFilter,
  ): Promise<ContentPagedResponse<AdminArticleListItem>> => {
    const response = await httpClient.get<
      ContentPagedResponse<AdminArticleListItem>
    >(BASE_URL, {
      params: filter,
    });

    return response.data;
  },

  getArticleById: async (articleId: number): Promise<AdminArticle> => {
    const response = await httpClient.get<AdminArticle>(
      `${BASE_URL}/${articleId}`,
    );

    return response.data;
  },

  createArticle: async (
    request: CreateAdminArticleRequest,
  ): Promise<CreateAdminArticleResponse> => {
    const response = await httpClient.post<CreateAdminArticleResponse>(
      BASE_URL,
      request,
    );

    return response.data;
  },

  updateArticle: async (
    request: UpdateAdminArticleRequest,
  ): Promise<UpdateAdminArticleResponse> => {
    const response = await httpClient.put<UpdateAdminArticleResponse>(
      `${BASE_URL}/${request.articleId}`,
      request,
    );

    return response.data;
  },

  getArticleRevisions: async (
    articleId: number,
  ): Promise<AdminArticleRevisionListItem[]> => {
    const response = await httpClient.get<AdminArticleRevisionListItem[]>(
      `${BASE_URL}/${articleId}/revisions`,
    );

    return response.data;
  },

  getArticleRevisionById: async (
    articleId: number,
    revisionId: number,
  ): Promise<AdminArticleRevisionDetail> => {
    const response = await httpClient.get<AdminArticleRevisionDetail>(
      `${BASE_URL}/${articleId}/revisions/${revisionId}`,
    );

    return response.data;
  },

  publishArticle: async (
    request: PublishAdminArticleRequest,
  ): Promise<PublishAdminArticleResponse> => {
    const { articleId, ...body } = request;

    const response = await httpClient.post<PublishAdminArticleResponse>(
      `${BASE_URL}/${articleId}:publish`,
      body,
    );

    return response.data;
  },

  unpublishArticle: async (
    request: UnpublishAdminArticleRequest,
  ): Promise<UnpublishAdminArticleResponse> => {
    const { articleId, ...body } = request;

    const response = await httpClient.post<UnpublishAdminArticleResponse>(
      `${BASE_URL}/${articleId}:unpublish`,
      body,
    );

    return response.data;
  },

  archiveArticle: async (
    request: ArchiveAdminArticleRequest,
  ): Promise<ArchiveAdminArticleResponse> => {
    const { articleId, ...body } = request;

    const response = await httpClient.post<ArchiveAdminArticleResponse>(
      `${BASE_URL}/${articleId}:archive`,
      body,
    );

    return response.data;
  },

  softDeleteArticle: async (
    request: SoftDeleteAdminArticleRequest,
  ): Promise<SoftDeleteAdminArticleResponse> => {
    const { articleId, ...body } = request;

    const response = await httpClient.delete<SoftDeleteAdminArticleResponse>(
      `${BASE_URL}/${articleId}`,
      {
        data: body,
      },
    );

    return response.data;
  },

  getArticleLifecycleEvents: async (
    articleId: number,
  ): Promise<AdminArticleLifecycleEventItem[]> => {
    const response = await httpClient.get<AdminArticleLifecycleEventItem[]>(
      `${BASE_URL}/${articleId}/lifecycle-events`,
    );

    return response.data;
  },

  getArticleTags: async (articleId: number): Promise<AdminArticleTagItem[]> => {
    const response = await httpClient.get<AdminArticleTagItem[]>(
      `${BASE_URL}/${articleId}/tags`,
    );

    return response.data;
  },
};
