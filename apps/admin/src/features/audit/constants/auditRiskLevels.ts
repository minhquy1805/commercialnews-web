export const AUDIT_RISK_LEVELS = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
} as const;

export type AuditRiskLevel = (typeof AUDIT_RISK_LEVELS)[keyof typeof AUDIT_RISK_LEVELS];

export const AUDIT_RISK_LEVEL_OPTIONS = Object.values(AUDIT_RISK_LEVELS).map((value) => ({
  label: value,
  value,
}));