import type { PageInfoPagedResult, PageRequest } from '../../../shared/pagination';
import type {
  AdminAuditActor,
  AdminAuditAggregate,
  AdminAuditResource,
} from './adminAuditCommon.types';

export type GetAdminAuditLogsRequest = PageRequest & {
  messageId?: string | null;
  sourceModule?: string | null;
  eventType?: string | null;
  action?: string | null;
  actionCategory?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  actorUserId?: string | null;
  actorInternalId?: number | null;
  outcome?: string | null;
  severity?: string | null;
  riskLevel?: string | null;
  correlationId?: string | null;
  fromUtc?: string | null;
  toUtc?: string | null;
  sort?: string | null;
};

export type GetAdminAuditLogsByCorrelationIdRequest = PageRequest & {
  fromUtc?: string | null;
  toUtc?: string | null;
};

export type GetAdminAuditTimelineRequest = PageRequest & {
  fromUtc?: string | null;
  toUtc?: string | null;
  sourceModule?: string | null;
  riskLevel?: string | null;
  sort?: string | null;
};

export type AdminAuditLogListItem = {
  publicId: string;
  messageId: string;

  eventType: string;
  sourceModule: string;
  action: string;
  actionCategory?: string | null;

  actor: AdminAuditActor;
  resource: AdminAuditResource;

  outcome: string;
  severity: string;
  riskLevel: string;
  summary: string;

  correlationId?: string | null;

  occurredAtUtc: string;
  ingestedAtUtc: string;
};

export type AdminAuditLogDetail = {
  publicId: string;
  messageId: string;

  eventType: string;
  eventVersion?: number | null;

  sourceModule: string;
  action: string;
  actionCategory?: string | null;

  aggregate: AdminAuditAggregate;
  actor: AdminAuditActor;
  resource: AdminAuditResource;

  outcome: string;
  severity: string;
  riskLevel: string;
  summary: string;
  reason?: string | null;

  correlationId?: string | null;
  causationId?: string | null;
  traceId?: string | null;

  ipAddress?: string | null;
  userAgent?: string | null;

  sourcePriority?: number | null;

  occurredAtUtc: string;
  ingestedAtUtc: string;
  createdAtUtc: string;

  metadataJson?: string | null;
  headersJson?: string | null;
  sanitizedPayloadJson?: string | null;
  beforeJson?: string | null;
  afterJson?: string | null;
  changesJson?: string | null;
};

export type AdminAuditLogsPagedResponse =
  PageInfoPagedResult<AdminAuditLogListItem>;

export type AdminAuditTimelinePagedResponse =
  PageInfoPagedResult<AdminAuditLogListItem>;