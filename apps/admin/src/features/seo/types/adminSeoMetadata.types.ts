import type { FlatPagedResult } from '../../../shared/pagination';
import type {
  SeoResourceType,
  SeoScope,
  SortDirection,
} from "../constants/seoConstants";

export type Nullable<T> = T | null;

// ==============================
// SEO Metadata - Shared
// ==============================

export type AdminSeoMetadataBase = {
  scope: string;
  resourceType: string;
  resourcePublicId: string;
  slug: Nullable<string>;
  canonicalUrl: Nullable<string>;
  metaTitle: Nullable<string>;
  metaDescription: Nullable<string>;
  ogTitle: Nullable<string>;
  ogDescription: Nullable<string>;
  ogImageUrl: Nullable<string>;
  twitterTitle: Nullable<string>;
  twitterDescription: Nullable<string>;
  twitterImageUrl: Nullable<string>;
  robots: Nullable<string>;
  sourceAggregateVersion: Nullable<number>;
  lastAppliedMessageId: Nullable<string>;
  lastSyncedAtUtc: Nullable<string>;
  version: number;
};

// ==============================
// GET /api/v1/admin/seo/metadata/{seoId}
// ==============================

export type AdminSeoMetadataDetail = AdminSeoMetadataBase & {
  seoId: number;
  isManualOverride: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
  updatedByUserId: Nullable<number>;
};

// ==============================
// GET /api/v1/admin/seo/metadata/by-resource
// ==============================

export type AdminSeoMetadataByResource = AdminSeoMetadataBase & {
  isManualOverride: Nullable<boolean>;
};

// ==============================
// GET /api/v1/admin/seo/metadata
// ==============================

export type AdminSeoMetadataListItem = AdminSeoMetadataBase & {
  seoId: number;
  isManualOverride: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
  updatedByUserId: Nullable<number>;
};

export type AdminSeoMetadataPagedResult = FlatPagedResult<AdminSeoMetadataListItem>;

export type AdminSeoMetadataFilter = {
  scope?: Nullable<SeoScope>;
  resourceType?: Nullable<SeoResourceType>;
  resourcePublicId?: Nullable<string>;
  isManualOverride?: Nullable<boolean>;
  updatedByUserId?: Nullable<number>;
  keyword?: Nullable<string>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type AdminSeoMetadataByResourceFilter = {
  resourceType: SeoResourceType;
  resourcePublicId: string;
  scope?: Nullable<SeoScope>;
};

// ==============================
// GET /api/v1/admin/seo/articles/{articlePublicId}
// ==============================

export type AdminArticleSeoSettings = AdminSeoMetadataBase & {
  articlePublicId: string;
  isManualOverride: Nullable<boolean>;
  isIndexable: Nullable<boolean>;
  isActive: Nullable<boolean>;
  slugRouteVersion: Nullable<number>;
  seoMetadataVersion: Nullable<number>;
};

// ==============================
// PUT /api/v1/admin/seo/articles/{articlePublicId}
// ==============================

export type UpsertAdminArticleSeoSettingsRequest = {
  scope?: Nullable<SeoScope>;
  slug?: Nullable<string>;
  canonicalUrl?: Nullable<string>;
  metaTitle?: Nullable<string>;
  metaDescription?: Nullable<string>;
  ogTitle?: Nullable<string>;
  ogDescription?: Nullable<string>;
  ogImageUrl?: Nullable<string>;
  twitterTitle?: Nullable<string>;
  twitterDescription?: Nullable<string>;
  twitterImageUrl?: Nullable<string>;
  robots?: Nullable<string>;
  isIndexable?: boolean;
  isActive?: boolean;
  expectedSlugVersion?: Nullable<number>;
  expectedSeoMetadataVersion?: Nullable<number>;
};

export type UpsertAdminArticleSeoSettingsResponse = AdminSeoMetadataBase & {
  updated: boolean;
  articlePublicId: string;
  isManualOverride: boolean;
  isIndexable: Nullable<boolean>;
  isActive: Nullable<boolean>;
  slugRouteVersion: Nullable<number>;
  seoMetadataVersion: Nullable<number>;
};
