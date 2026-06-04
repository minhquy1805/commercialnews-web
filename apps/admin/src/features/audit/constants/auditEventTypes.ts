export const AUDIT_EVENT_TYPES = {
  AuthorizationUserRoleAssigned: 'authorization.user_role_assigned',
  AuthorizationUserRoleRevoked: 'authorization.user_role_revoked',

  AuthorizationRolePermissionGranted: 'authorization.role_permission_granted',
  AuthorizationRolePermissionRevoked: 'authorization.role_permission_revoked',

  AuthorizationRoleCreated: 'authorization.role_created',
  AuthorizationRoleUpdated: 'authorization.role_updated',
  AuthorizationRoleActivated: 'authorization.role_activated',
  AuthorizationRoleDeactivated: 'authorization.role_deactivated',

  AuthorizationPermissionCreated: 'authorization.permission_created',
  AuthorizationPermissionUpdated: 'authorization.permission_updated',
  AuthorizationPermissionActivated: 'authorization.permission_activated',
  AuthorizationPermissionDeactivated: 'authorization.permission_deactivated',

  IdentityEmailVerified: 'identity.email_verified',
  IdentityPasswordChanged: 'identity.password_changed',
  IdentityUserActivated: 'identity.user_activated',
  IdentityUserDisabled: 'identity.user_disabled',
  IdentityUserLocked: 'identity.user_locked',
  IdentityUserUnlocked: 'identity.user_unlocked',
  IdentityEmailMarkedVerified: 'identity.email_marked_verified',
  IdentityUserSessionsRevoked: 'identity.user_sessions_revoked',

  ContentArticleCreated: 'content.article_created',
  ContentArticleUpdated: 'content.article_updated',
  ContentArticlePublished: 'content.article_published',
  ContentArticleUnpublished: 'content.article_unpublished',
  ContentArticleArchived: 'content.article_archived',
  ContentArticleSoftDeleted: 'content.article_soft_deleted',

  MediaAssetRegistered: 'media.asset_registered',
  MediaAssetUpdated: 'media.asset_updated',
  MediaAssetSoftDeleted: 'media.asset_soft_deleted',
  MediaAssetRestored: 'media.asset_restored',
  MediaArticleMediaAttached: 'media.article_media_attached',
  MediaArticleMediaDetached: 'media.article_media_detached',
  MediaArticleMediaReordered: 'media.article_media_reordered',
  MediaArticlePrimaryMediaSet: 'media.article_primary_media_set',

  InteractionCommentHidden: 'interaction.comment_hidden',
  InteractionCommentRestored: 'interaction.comment_restored',
  InteractionCommentDeletedByAuthor: 'interaction.comment_deleted_by_author',
  InteractionCommentReportsDismissed: 'interaction.comment_reports_dismissed',
} as const;

export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[keyof typeof AUDIT_EVENT_TYPES];

export const AUDIT_EVENT_TYPE_OPTIONS = Object.values(AUDIT_EVENT_TYPES).map((value) => ({
  label: value,
  value,
}));

export const AUDIT_AUTHORIZATION_EVENT_TYPES = [
  AUDIT_EVENT_TYPES.AuthorizationUserRoleAssigned,
  AUDIT_EVENT_TYPES.AuthorizationUserRoleRevoked,
  AUDIT_EVENT_TYPES.AuthorizationRolePermissionGranted,
  AUDIT_EVENT_TYPES.AuthorizationRolePermissionRevoked,
  AUDIT_EVENT_TYPES.AuthorizationRoleCreated,
  AUDIT_EVENT_TYPES.AuthorizationRoleUpdated,
  AUDIT_EVENT_TYPES.AuthorizationRoleActivated,
  AUDIT_EVENT_TYPES.AuthorizationRoleDeactivated,
  AUDIT_EVENT_TYPES.AuthorizationPermissionCreated,
  AUDIT_EVENT_TYPES.AuthorizationPermissionUpdated,
  AUDIT_EVENT_TYPES.AuthorizationPermissionActivated,
  AUDIT_EVENT_TYPES.AuthorizationPermissionDeactivated,
] as const;

export const AUDIT_IDENTITY_EVENT_TYPES = [
  AUDIT_EVENT_TYPES.IdentityEmailVerified,
  AUDIT_EVENT_TYPES.IdentityPasswordChanged,
  AUDIT_EVENT_TYPES.IdentityUserActivated,
  AUDIT_EVENT_TYPES.IdentityUserDisabled,
  AUDIT_EVENT_TYPES.IdentityUserLocked,
  AUDIT_EVENT_TYPES.IdentityUserUnlocked,
  AUDIT_EVENT_TYPES.IdentityEmailMarkedVerified,
  AUDIT_EVENT_TYPES.IdentityUserSessionsRevoked,
] as const;

export const AUDIT_CONTENT_EVENT_TYPES = [
  AUDIT_EVENT_TYPES.ContentArticleCreated,
  AUDIT_EVENT_TYPES.ContentArticleUpdated,
  AUDIT_EVENT_TYPES.ContentArticlePublished,
  AUDIT_EVENT_TYPES.ContentArticleUnpublished,
  AUDIT_EVENT_TYPES.ContentArticleArchived,
  AUDIT_EVENT_TYPES.ContentArticleSoftDeleted,
] as const;

export const AUDIT_MEDIA_EVENT_TYPES = [
  AUDIT_EVENT_TYPES.MediaAssetRegistered,
  AUDIT_EVENT_TYPES.MediaAssetUpdated,
  AUDIT_EVENT_TYPES.MediaAssetSoftDeleted,
  AUDIT_EVENT_TYPES.MediaAssetRestored,
  AUDIT_EVENT_TYPES.MediaArticleMediaAttached,
  AUDIT_EVENT_TYPES.MediaArticleMediaDetached,
  AUDIT_EVENT_TYPES.MediaArticleMediaReordered,
  AUDIT_EVENT_TYPES.MediaArticlePrimaryMediaSet,
] as const;

export const AUDIT_INTERACTION_EVENT_TYPES = [
  AUDIT_EVENT_TYPES.InteractionCommentHidden,
  AUDIT_EVENT_TYPES.InteractionCommentRestored,
  AUDIT_EVENT_TYPES.InteractionCommentDeletedByAuthor,
  AUDIT_EVENT_TYPES.InteractionCommentReportsDismissed,
] as const;