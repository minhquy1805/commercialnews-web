export const AUDIT_ACTOR_TYPES = {
  User: 'User',
  Admin: 'Admin',
  Moderator: 'Moderator',
  System: 'System',
  Worker: 'Worker',
  Anonymous: 'Anonymous',
  External: 'External',
} as const;

export type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[keyof typeof AUDIT_ACTOR_TYPES];

export const AUDIT_ACTOR_TYPE_OPTIONS = Object.values(AUDIT_ACTOR_TYPES).map((value) => ({
  label: value,
  value,
}));