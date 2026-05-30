import type { ArticleLifecycleActionType } from '../constants/articleLifecycleActionTypes';
import type { ArticleStatus } from '../constants/articleStatuses';

export type AdminArticle = {
  articleId: number;
  articlePublicId: string;
  categoryId: number | null;
  authorUserId: number;
  title: string;
  summary: string | null;
  body: string;
  status: ArticleStatus;
  coverMediaId: number | null;
  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;
  unpublishedAt: string | null;
  archivedAt: string | null;
  createdByUserId: number | null;
  updatedByUserId: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedByUserId: number | null;
  version: number;
};

export type AdminArticleListItem = {
  articleId: number;
  articlePublicId: string;
  categoryId: number | null;
  authorUserId: number;
  title: string;
  summary: string | null;
  status: ArticleStatus;
  coverMediaId: number | null;
  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;
  unpublishedAt: string | null;
  archivedAt: string | null;
  isDeleted: boolean;
  version: number;
};

export type AdminArticleFilter = {
  page?: number;
  pageSize?: number;
  keyword?: string | null;
  status?: ArticleStatus | null;
  categoryId?: number | null;
  authorUserId?: number | null;
  isDeleted?: boolean;
  sort?: string | null;
};

export type CreateAdminArticleRequest = {
  categoryId?: number | null;
  authorUserId: number;
  title: string;
  summary?: string | null;
  body: string;
  coverMediaId?: number | null;
  tagIds?: number[];
};

export type CreateAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  categoryId: number | null;
  authorUserId: number;
  title: string;
  summary: string | null;
  status: ArticleStatus;
  coverMediaId: number | null;
  tagIds: number[];
  version: number;
  createdAt: string;
};

export type UpdateAdminArticleRequest = {
  articleId: number;
  categoryId?: number | null;
  title: string;
  summary?: string | null;
  body: string;
  coverMediaId?: number | null;
  tagIds?: number[];
  changeSummary?: string | null;
  expectedVersion: number;
};

export type UpdateAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  categoryId: number | null;
  authorUserId: number;
  title: string;
  summary: string | null;
  body: string;
  status: ArticleStatus;
  coverMediaId: number | null;
  tagIds: number[];
  version: number;
  updatedAt: string;
};

export type PublishAdminArticleRequest = {
  articleId: number;
  expectedVersion: number;
};

export type PublishAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  status: ArticleStatus;
  publishedAt: string;
  version: number;
  updatedAt: string;
};

export type UnpublishAdminArticleRequest = {
  articleId: number;
  expectedVersion: number;
  reason?: string | null;
};

export type UnpublishAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  status: ArticleStatus;
  unpublishedAt: string;
  version: number;
  updatedAt: string;
};

export type ArchiveAdminArticleRequest = {
  articleId: number;
  expectedVersion: number;
};

export type ArchiveAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  status: ArticleStatus;
  archivedAt: string;
  version: number;
  updatedAt: string;
};

export type SoftDeleteAdminArticleRequest = {
  articleId: number;
  expectedVersion: number;
};

export type SoftDeleteAdminArticleResponse = {
  articleId: number;
  articlePublicId: string;
  isDeleted: boolean;
  version: number;
  updatedAt: string;
  deletedAt: string;
  deletedByUserId: number;
};

export type AdminArticleRevisionListItem = {
  revisionId: number;
  articleId: number;
  articleVersion: number;
  titleSnapshot: string;
  summarySnapshot: string | null;
  bodySnapshot: string;
  categoryIdSnapshot: number | null;
  statusSnapshot: ArticleStatus;
  coverMediaIdSnapshot: number | null;
  changeSummary: string | null;
  editedByUserId: number | null;
  editedAt: string;
  correlationId: string | null;
};

export type AdminArticleRevisionDetail = AdminArticleRevisionListItem;

export type AdminArticleLifecycleEventItem = {
  eventId: number;
  articleId: number;
  articleVersion: number;
  actionType: ArticleLifecycleActionType;
  fromStatus: ArticleStatus | null;
  toStatus: ArticleStatus | null;
  reason: string | null;
  actorUserId: number | null;
  occurredAt: string;
  correlationId: string | null;
  metadataJson: string | null;
};

export type AdminArticleTagItem = {
  articleId: number;
  tagId: number;
  tagName: string;
  tagNameNormalized: string;
  attachedAt: string;
  attachedByUserId: number | null;
};