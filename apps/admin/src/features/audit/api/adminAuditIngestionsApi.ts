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
  getIngestions(params: GetAdminAuditIngestionListRequest) {
    return httpClient.get<AdminAuditIngestionsPagedResponse>(BASE_URL, {
      params,
    });
  },

  getFailedIngestions(params: GetFailedAdminAuditIngestionListRequest) {
    return httpClient.get<AdminFailedAuditIngestionsPagedResponse>(
      `${BASE_URL}/failed`,
      {
        params,
      },
    );
  },

  getIngestionByPublicId(publicId: string) {
    return httpClient.get<AdminAuditIngestionDetail>(
      `${BASE_URL}/${publicId}`,
    );
  },

  getIngestionByMessageId(messageId: string) {
    return httpClient.get<AdminAuditIngestionDetail>(
      `${BASE_URL}/by-message/${messageId}`,
    );
  },
};