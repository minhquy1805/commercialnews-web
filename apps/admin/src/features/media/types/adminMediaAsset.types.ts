import type { FlatPagedResult } from '../../../shared/pagination';

export type AdminMediaAssetSortDirection = 'ASC' | 'DESC';

export type AdminMediaAssetType = 'Image' | 'Video' | 'File';

export type AdminMediaStorageProvider = string;

export type AdminMediaAsset = {
  mediaId: number;
  publicId: string;

  storageProvider: AdminMediaStorageProvider;
  url: string;
  storagePath?: string | null;

  fileName: string;
  originalFileName?: string | null;

  mediaType: AdminMediaAssetType;
  mimeType?: string | null;
  fileSizeBytes?: number | null;

  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;

  altText?: string | null;
  metadataJson?: string | null;
  contentHash?: string | null;

  createdAt: string;
  createdBy?: string | null;

  updatedAt?: string | null;
  updatedBy?: string | null;

  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;

  restoreUntil?: string | null;
  restoredAt?: string | null;
  restoredBy?: string | null;

  version: number;
};

export type AdminMediaAssetsQuery = {
  page?: number;
  pageSize?: number;
  isDeleted?: boolean | null;
  mediaType?: AdminMediaAssetType | null;
  sortBy?: string;
  sortDirection?: AdminMediaAssetSortDirection;
};

export type AdminMediaAssetsResponse = FlatPagedResult<AdminMediaAsset>;

export type CreateMediaAssetRequest = {
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

  altText?: string | null;
  metadataJson?: string | null;
  contentHash?: string | null;
};

export type UploadMediaAssetRequest = {
  file: File;
  mediaType: AdminMediaAssetType;
  altText?: string | null;
  metadataJson?: string | null;
  folder?: string | null;
};

export type UpdateMediaAssetRequest = {
  altText?: string | null;
  metadataJson?: string | null;
};

export type SoftDeleteMediaAssetRequest = {
  restoreUntil?: string | null;
};

export type AdminMediaAssetUsageItem = {
  articleMediaId: number;
  articleId: number;
  attachmentSetVersion: number;

  mediaId: number;

  sortOrder: number;
  isPrimary: boolean;

  altTextOverride?: string | null;
  caption?: string | null;

  createdAt: string;
  createdBy?: string | null;

  updatedAt?: string | null;
  updatedBy?: string | null;

  version: number;

  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
};

export type AdminMediaAssetUsagesResponse = {
  mediaId: number;
  items: AdminMediaAssetUsageItem[];
};