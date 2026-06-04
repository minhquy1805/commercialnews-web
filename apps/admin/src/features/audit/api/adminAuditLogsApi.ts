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
  async getLogs(params: GetAdminAuditLogsRequest) {
    const response = await httpClient.get<AdminAuditLogsPagedResponse>(
      `${BASE_URL}/logs`,
      { params },
    );

    return response.data;
  },

  async getLogByPublicId(publicId: string) {
    const response = await httpClient.get<AdminAuditLogDetail>(
      `${BASE_URL}/logs/${encodeURIComponent(publicId)}`,
    );

    return response.data;
  },

  async getLogByMessageId(messageId: string) {
    const response = await httpClient.get<AdminAuditLogDetail>(
      `${BASE_URL}/logs/by-message/${encodeURIComponent(messageId)}`,
    );

    return response.data;
  },

  async getLogsByCorrelationId(
    correlationId: string,
    params?: GetAdminAuditLogsByCorrelationIdRequest,
  ) {
    const response = await httpClient.get<AdminAuditLogsPagedResponse>(
      `${BASE_URL}/logs/by-correlation/${encodeURIComponent(correlationId)}`,
      { params },
    );

    return response.data;
  },

  async getModuleLogs(sourceModule: string, params: GetAdminAuditLogsRequest) {
    const response = await httpClient.get<AdminAuditLogsPagedResponse>(
      `${BASE_URL}/modules/${encodeURIComponent(sourceModule)}/logs`,
      { params },
    );

    return response.data;
  },

  async getResourceTimeline(
    resourceType: string,
    resourceId: string,
    params: GetAdminAuditTimelineRequest,
  ) {
    const response = await httpClient.get<AdminAuditTimelinePagedResponse>(
      `${BASE_URL}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(
        resourceId,
      )}/timeline`,
      { params },
    );

    return response.data;
  },

  async getActorTimeline(
    actorUserId: string,
    params: GetAdminAuditTimelineRequest,
  ) {
    const response = await httpClient.get<AdminAuditTimelinePagedResponse>(
      `${BASE_URL}/actors/${encodeURIComponent(actorUserId)}/timeline`,
      { params },
    );

    return response.data;
  },
};