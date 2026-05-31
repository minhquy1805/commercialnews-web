import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminCommentDetail,
  AdminCommentModerationHistoryFilter,
  AdminCommentModerationHistoryResponse,
  AdminCommentsFilter,
  AdminCommentsResponse,
  HideAdminCommentRequest,
  HideAdminCommentResponse,
  RestoreAdminCommentRequest,
  RestoreAdminCommentResponse,
} from '../types/adminComment.types';

const BASE_URL = '/api/v1/admin/interaction/comments';

export const adminCommentsApi = {
  getComments: async (
    filter: AdminCommentsFilter,
  ): Promise<AdminCommentsResponse> => {
    const response = await httpClient.get<AdminCommentsResponse>(BASE_URL, {
      params: filter,
    });

    return response.data;
  },

  getCommentByPublicId: async (
    commentPublicId: string,
  ): Promise<AdminCommentDetail> => {
    const response = await httpClient.get<AdminCommentDetail>(
      `${BASE_URL}/${commentPublicId}`,
    );

    return response.data;
  },

  hideComment: async (
    commentPublicId: string,
    request: HideAdminCommentRequest,
  ): Promise<HideAdminCommentResponse> => {
    const response = await httpClient.post<HideAdminCommentResponse>(
      `${BASE_URL}/${commentPublicId}/hide`,
      request,
    );

    return response.data;
  },

  restoreComment: async (
    commentPublicId: string,
    request: RestoreAdminCommentRequest,
  ): Promise<RestoreAdminCommentResponse> => {
    const response = await httpClient.post<RestoreAdminCommentResponse>(
      `${BASE_URL}/${commentPublicId}/restore`,
      request,
    );

    return response.data;
  },

  getCommentModerationHistory: async (
    commentPublicId: string,
    filter: AdminCommentModerationHistoryFilter,
  ): Promise<AdminCommentModerationHistoryResponse> => {
    const response = await httpClient.get<AdminCommentModerationHistoryResponse>(
      `${BASE_URL}/${commentPublicId}/moderation-history`,
      {
        params: filter,
      },
    );

    return response.data;
  },
};