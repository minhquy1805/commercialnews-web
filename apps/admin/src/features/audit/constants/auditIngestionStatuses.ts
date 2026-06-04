export const AUDIT_INGESTION_STATUSES = {
  Processing: 'Processing',
  Succeeded: 'Succeeded',
  Duplicate: 'Duplicate',
  Ignored: 'Ignored',
  Failed: 'Failed',
  DeadLettered: 'DeadLettered',
} as const;

export type AuditIngestionStatus =
  (typeof AUDIT_INGESTION_STATUSES)[keyof typeof AUDIT_INGESTION_STATUSES];

export const AUDIT_INGESTION_STATUS_OPTIONS = Object.values(AUDIT_INGESTION_STATUSES).map(
  (value) => ({
    label: value,
    value,
  }),
);

export const AUDIT_TERMINAL_INGESTION_STATUSES = [
  AUDIT_INGESTION_STATUSES.Succeeded,
  AUDIT_INGESTION_STATUSES.Duplicate,
  AUDIT_INGESTION_STATUSES.Ignored,
  AUDIT_INGESTION_STATUSES.DeadLettered,
] as const;