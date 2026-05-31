import type { FlatPagedResult } from '../../../shared/pagination';
import type {
  AdminMediaAssetSortDirection,
  AdminMediaAssetType,
  AdminMediaStorageProvider,
} from './adminMediaAsset.types';

export type AdminArticleMediaSortDirection = AdminMediaAssetSortDirection;

export type AdminArticleMediaListQuery = {
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
  sortBy?: string;
  sortDirection?: AdminArticleMediaSortDirection;
};

export type AttachMediaToArticleRequest = {
  mediaId: number;
  isPrimary?: boolean;
};

export type AttachMediaToArticleResponse = {
  articleMediaId: number;
  articleId: number;
  mediaId: number;

  attached: boolean;
  isPrimary: boolean;
  primaryChanged: boolean;

  affectedRows: number;
  attachmentSetVersion: number;
};

export type DetachMediaFromArticleResponse = {
  articleId: number;
  mediaId: number;

  detached: boolean;
  primaryCleared: boolean;

  affectedRows: number;
  attachmentSetVersion: number;
};

export type SetPrimaryMediaRequest = {
  mediaId: number;
  expectedVersion: number;
};

export type SetPrimaryMediaResponse = {
  articleId: number;
  mediaId: number;

  primarySet: boolean;

  affectedRows: number;
  attachmentSetVersion: number;
};

export type ReorderArticleMediaItemRequest = {
  mediaId: number;
  sortOrder: number;
};

export type ReorderArticleMediaRequest = {
  expectedVersion: number;
  items: ReorderArticleMediaItemRequest[];
};

export type ReorderArticleMediaResponse = {
  articleId: number;

  reordered: boolean;

  affectedRows: number;
  attachmentSetVersion: number;
};

export type AdminArticleMediaItem = {
  articleMediaId: number;
  articleId: number;
  attachmentSetVersion: number;

  mediaId: number;
  publicId: string;

  storageProvider: AdminMediaStorageProvider;
  url: string;
  storagePath?: string | null;

  fileName: string;

  mediaType: AdminMediaAssetType;
  mimeType?: string | null;
  fileSizeBytes?: number | null;

  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;

  defaultAltText?: string | null;
  mediaIsDeleted: boolean;

  altTextOverride?: string | null;
  caption?: string | null;

  sortOrder: number;
  isPrimary: boolean;

  createdAt: string;
  createdBy?: string | null;

  updatedAt?: string | null;
  updatedBy?: string | null;

  version: number;

  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
};

export type AdminArticleMediaListResponse = FlatPagedResult<AdminArticleMediaItem>;

export type AdminArticlePrimaryMediaResponse = AdminArticleMediaItem;

export type AdminArticleMediaSetState = {
  articleId: number;
  version: number;

  createdAt: string;
  createdBy?: string | null;

  updatedAt?: string | null;
  updatedBy?: string | null;
};