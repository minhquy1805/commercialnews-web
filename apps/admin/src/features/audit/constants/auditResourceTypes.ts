export const AUDIT_RESOURCE_TYPES = {
  Role: 'Role',
  Permission: 'Permission',
  UserRole: 'UserRole',
  RolePermission: 'RolePermission',

  UserAccount: 'UserAccount',
  LoginHistory: 'LoginHistory',
  RefreshToken: 'RefreshToken',
  EmailVerificationToken: 'EmailVerificationToken',
  PasswordResetToken: 'PasswordResetToken',

  Article: 'Article',
  ArticleRevision: 'ArticleRevision',
  ArticleLifecycleEvent: 'ArticleLifecycleEvent',
  ArticleTag: 'ArticleTag',
  Category: 'Category',
  Tag: 'Tag',

  MediaAsset: 'MediaAsset',
  MediaVariant: 'MediaVariant',
  ArticleMedia: 'ArticleMedia',
  ArticleMediaSet: 'ArticleMediaSet',

  Comment: 'Comment',
  CommentReport: 'CommentReport',
  CommentModerationCase: 'CommentModerationCase',
  CommentModerationActionHistory: 'CommentModerationActionHistory',
  ArticleLike: 'ArticleLike',
  ArticleViewCount: 'ArticleViewCount',
  ArticleInteractionStats: 'ArticleInteractionStats',
  ArticleInteractionTargetProjection: 'ArticleInteractionTargetProjection',

  SeoMetadata: 'SeoMetadata',
  SlugRegistry: 'SlugRegistry',
  SeoRoute: 'SeoRoute',

  EmailDelivery: 'EmailDelivery',
  EmailDeliveryAttempt: 'EmailDeliveryAttempt',
} as const;

export type AuditResourceType =
  (typeof AUDIT_RESOURCE_TYPES)[keyof typeof AUDIT_RESOURCE_TYPES];

export const AUDIT_RESOURCE_TYPE_OPTIONS = Object.values(AUDIT_RESOURCE_TYPES).map((value) => ({
  label: value,
  value,
}));

export const AUDIT_CURRENT_BASELINE_RESOURCE_TYPES = [
  AUDIT_RESOURCE_TYPES.Role,
  AUDIT_RESOURCE_TYPES.Permission,
  AUDIT_RESOURCE_TYPES.UserRole,
  AUDIT_RESOURCE_TYPES.RolePermission,

  AUDIT_RESOURCE_TYPES.UserAccount,

  AUDIT_RESOURCE_TYPES.Article,

  AUDIT_RESOURCE_TYPES.MediaAsset,
  AUDIT_RESOURCE_TYPES.ArticleMedia,
  AUDIT_RESOURCE_TYPES.ArticleMediaSet,

  AUDIT_RESOURCE_TYPES.Comment,
  AUDIT_RESOURCE_TYPES.CommentReport,
  AUDIT_RESOURCE_TYPES.CommentModerationCase,
] as const;