export const AUDIT_INGESTION_ERROR_CLASSES = {
  Transient: 'Transient',
  Permanent: 'Permanent',
  Ambiguous: 'Ambiguous',
  Validation: 'Validation',
  Policy: 'Policy',
  Redaction: 'Redaction',
  Unknown: 'Unknown',
} as const;

export type AuditIngestionErrorClass =
  (typeof AUDIT_INGESTION_ERROR_CLASSES)[keyof typeof AUDIT_INGESTION_ERROR_CLASSES];

export const AUDIT_INGESTION_ERROR_CLASS_OPTIONS = Object.values(
  AUDIT_INGESTION_ERROR_CLASSES,
).map((value) => ({
  label: value,
  value,
}));