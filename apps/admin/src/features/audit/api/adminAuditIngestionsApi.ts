import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminAuditIngestionDetail,
  AdminAuditIngestionsPagedResponse,
  AdminFailedAuditIngestionsPagedResponse,
  GetAdminAuditIngestionListRequest,
  GetFailedAdminAuditIngestionListRequest,
} from '../types';

const BASE_URL = '/api/v1/admin/audit/ingestions';

export const adminAuditIngestionsApi = {
  async getIngestions(params: GetAdminAuditIngestionListRequest) {
    const response = await httpClient.get<AdminAuditIngestionsPagedResponse>(
      BASE_URL,
      { params },
    );

    return response.data;
  },

  async getFailedIngestions(params: GetFailedAdminAuditIngestionListRequest) {
    const response =
      await httpClient.get<AdminFailedAuditIngestionsPagedResponse>(
        `${BASE_URL}/failed`,
        { params },
      );

    return response.data;
  },

  async getIngestionByPublicId(publicId: string) {
    const response = await httpClient.get<AdminAuditIngestionDetail>(
      `${BASE_URL}/${encodeURIComponent(publicId)}`,
    );

    return response.data;
  },

  async getIngestionByMessageId(messageId: string) {
    const response = await httpClient.get<AdminAuditIngestionDetail>(
      `${BASE_URL}/by-message/${encodeURIComponent(messageId)}`,
    );

    return response.data;
  },
};