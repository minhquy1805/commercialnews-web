import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminModerationCaseDetail,
  AdminModerationCasesFilter,
  AdminModerationCasesResponse,
  DismissAdminModerationCaseRequest,
  DismissAdminModerationCaseResponse,
  HideAdminModerationCaseCommentRequest,
  HideAdminModerationCaseCommentResponse,
} from '../types/adminModerationCase.types';

const BASE_URL = '/api/v1/admin/interaction/comment-moderation-cases';

export const adminModerationCasesApi = {
  getModerationCases: async (
    filter: AdminModerationCasesFilter,
  ): Promise<AdminModerationCasesResponse> => {
    const response = await httpClient.get<AdminModerationCasesResponse>(
      BASE_URL,
      {
        params: filter,
      },
    );

    return response.data;
  },

  getModerationCaseByPublicId: async (
    casePublicId: string,
  ): Promise<AdminModerationCaseDetail> => {
    const response = await httpClient.get<AdminModerationCaseDetail>(
      `${BASE_URL}/${casePublicId}`,
    );

    return response.data;
  },

  dismissModerationCase: async (
    casePublicId: string,
    request: DismissAdminModerationCaseRequest,
  ): Promise<DismissAdminModerationCaseResponse> => {
    const response = await httpClient.post<DismissAdminModerationCaseResponse>(
      `${BASE_URL}/${casePublicId}/dismiss`,
      request,
    );

    return response.data;
  },

  hideModerationCaseComment: async (
    casePublicId: string,
    request: HideAdminModerationCaseCommentRequest,
  ): Promise<HideAdminModerationCaseCommentResponse> => {
    const response =
      await httpClient.post<HideAdminModerationCaseCommentResponse>(
        `${BASE_URL}/${casePublicId}/hide-comment`,
        request,
      );

    return response.data;
  },
};