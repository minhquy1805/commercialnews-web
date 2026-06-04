export const AUDIT_SEVERITIES = {
  Info: 'Info',
  Warning: 'Warning',
  Error: 'Error',
  Critical: 'Critical',
} as const;

export type AuditSeverity = (typeof AUDIT_SEVERITIES)[keyof typeof AUDIT_SEVERITIES];

export const AUDIT_SEVERITY_OPTIONS = Object.values(AUDIT_SEVERITIES).map((value) => ({
  label: value,
  value,
}));