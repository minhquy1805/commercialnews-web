export const AUDIT_OUTCOMES = {
  Success: 'Success',
  Failure: 'Failure',
  Denied: 'Denied',
  Ignored: 'Ignored',
} as const;

export type AuditOutcome = (typeof AUDIT_OUTCOMES)[keyof typeof AUDIT_OUTCOMES];

export const AUDIT_OUTCOME_OPTIONS = Object.values(AUDIT_OUTCOMES).map((value) => ({
  label: value,
  value,
}));