import { httpClient } from '../../../shared/api/httpClient';
import type {
  AdminAuditLogDetail,
  AdminAuditLogsPagedResponse,
  AdminAuditTimelinePagedResponse,
  GetAdminAuditLogsByCorrelationIdRequest,
  GetAdminAuditLogsRequest,
  GetAdminAuditTimelineRequest,
} from '../types';

const BASE_URL = '/api/v1/admin/audit';

export const adminAuditLogsApi = {
  getLogs(params: GetAdminAuditLogsRequest) {
    return httpClient.get<AdminAuditLogsPagedResponse>(`${BASE_URL}/logs`, {
      params,
    });
  },

  getLogByPublicId(publicId: string) {
    return httpClient.get<AdminAuditLogDetail>(`${BASE_URL}/logs/${publicId}`);
  },

  getLogByMessageId(messageId: string) {
    return httpClient.get<AdminAuditLogDetail>(
      `${BASE_URL}/logs/by-message/${messageId}`,
    );
  },

  getLogsByCorrelationId(
    correlationId: string,
    params?: GetAdminAuditLogsByCorrelationIdRequest,
  ) {
    return httpClient.get<AdminAuditLogsPagedResponse>(
      `${BASE_URL}/logs/by-correlation/${correlationId}`,
      {
        params,
      },
    );
  },

  getModuleLogs(sourceModule: string, params: GetAdminAuditLogsRequest) {
    return httpClient.get<AdminAuditLogsPagedResponse>(
      `${BASE_URL}/modules/${sourceModule}/logs`,
      {
        params,
      },
    );
  },

  getResourceTimeline(
    resourceType: string,
    resourceId: string,
    params: GetAdminAuditTimelineRequest,
  ) {
    return httpClient.get<AdminAuditTimelinePagedResponse>(
      `${BASE_URL}/resources/${resourceType}/${resourceId}/timeline`,
      {
        params,
      },
    );
  },

  getActorTimeline(
    actorUserId: string,
    params: GetAdminAuditTimelineRequest,
  ) {
    return httpClient.get<AdminAuditTimelinePagedResponse>(
      `${BASE_URL}/actors/${actorUserId}/timeline`,
      {
        params,
      },
    );
  },
};