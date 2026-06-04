import type { PageInfoPagedResult, PageRequest } from '../../../shared/pagination';

export type GetAdminAuditIngestionListRequest = PageRequest & {
  status?: string | null;
  messageId?: string | null;
  eventType?: string | null;
  aggregateType?: string | null;
  aggregateId?: string | null;
  aggregatePublicId?: string | null;
  correlationId?: string | null;
  consumerName?: string | null;
  lastErrorClass?: string | null;
  fromUtc?: string | null;
  toUtc?: string | null;
  sort?: string | null;
};

export type GetFailedAdminAuditIngestionListRequest = PageRequest & {
  eventType?: string | null;
  aggregateType?: string | null;
  aggregateId?: string | null;
  aggregatePublicId?: string | null;
  correlationId?: string | null;
  consumerName?: string | null;
  lastErrorClass?: string | null;
  fromUtc?: string | null;
  toUtc?: string | null;
  sort?: string | null;
};

export type AdminAuditIngestionListItem = {
  publicId: string;
  messageId: string;
  eventType: string;

  aggregateType?: string | null;
  aggregateId?: string | null;
  aggregatePublicId?: string | null;
  aggregateVersion?: number | null;

  correlationId?: string | null;
  sourcePriority?: number | null;

  sourceOccurredAtUtc: string;
  sourcePublishedAtUtc?: string | null;

  consumerName: string;
  status: string;
  attemptCount: number;

  firstReceivedAtUtc: string;
  lastAttemptAtUtc?: string | null;
  processedAtUtc?: string | null;
  deadLetteredAtUtc?: string | null;

  lastErrorCode?: string | null;
  lastErrorClass?: string | null;

  createdAtUtc: string;
  updatedAtUtc: string;
};

export type AdminAuditIngestionDetail = AdminAuditIngestionListItem & {
  lastErrorMessage?: string | null;
};

export type AdminAuditIngestionsPagedResponse =
  PageInfoPagedResult<AdminAuditIngestionListItem>;

export type AdminFailedAuditIngestionsPagedResponse =
  PageInfoPagedResult<AdminAuditIngestionListItem>;