export const AUDIT_SOURCE_MODULES = {
  Authorization: 'Authorization',
  Identity: 'Identity',
  Content: 'Content',
  Media: 'Media',
  Interaction: 'Interaction',

  Seo: 'SEO',
  Notifications: 'Notifications',

  Audit: 'Audit',
  System: 'System',
} as const;

export type AuditSourceModule =
  (typeof AUDIT_SOURCE_MODULES)[keyof typeof AUDIT_SOURCE_MODULES];

export const AUDIT_SOURCE_MODULE_OPTIONS = Object.values(AUDIT_SOURCE_MODULES).map((value) => ({
  label: value,
  value,
}));

export const AUDIT_CURRENT_V1_SOURCE_MODULES = [
  AUDIT_SOURCE_MODULES.Authorization,
  AUDIT_SOURCE_MODULES.Identity,
  AUDIT_SOURCE_MODULES.Content,
  AUDIT_SOURCE_MODULES.Media,
  AUDIT_SOURCE_MODULES.Interaction,
] as const;

export const AUDIT_FUTURE_EXTENSION_SOURCE_MODULES = [
  AUDIT_SOURCE_MODULES.Seo,
  AUDIT_SOURCE_MODULES.Notifications,
  AUDIT_SOURCE_MODULES.Audit,
  AUDIT_SOURCE_MODULES.System,
] as const;