export const AUDIT_ACTION_CATEGORIES = {
  Authentication: 'Authentication',
  Authorization: 'Authorization',
  IdentitySecurity: 'IdentitySecurity',
  ContentLifecycle: 'ContentLifecycle',
  Moderation: 'Moderation',
  MediaGovernance: 'MediaGovernance',

  SeoGovernance: 'SeoGovernance',
  NotificationDelivery: 'NotificationDelivery',
  AuditIngestion: 'AuditIngestion',
  System: 'System',
} as const;

export type AuditActionCategory =
  (typeof AUDIT_ACTION_CATEGORIES)[keyof typeof AUDIT_ACTION_CATEGORIES];

export const AUDIT_ACTION_CATEGORY_OPTIONS = Object.values(AUDIT_ACTION_CATEGORIES).map(
  (value) => ({
    label: value,
    value,
  }),
);

export const AUDIT_CURRENT_V1_ACTION_CATEGORIES = [
  AUDIT_ACTION_CATEGORIES.Authentication,
  AUDIT_ACTION_CATEGORIES.Authorization,
  AUDIT_ACTION_CATEGORIES.IdentitySecurity,
  AUDIT_ACTION_CATEGORIES.ContentLifecycle,
  AUDIT_ACTION_CATEGORIES.MediaGovernance,
  AUDIT_ACTION_CATEGORIES.Moderation,
] as const;

export const AUDIT_FUTURE_EXTENSION_ACTION_CATEGORIES = [
  AUDIT_ACTION_CATEGORIES.SeoGovernance,
  AUDIT_ACTION_CATEGORIES.NotificationDelivery,
  AUDIT_ACTION_CATEGORIES.AuditIngestion,
  AUDIT_ACTION_CATEGORIES.System,
] as const;