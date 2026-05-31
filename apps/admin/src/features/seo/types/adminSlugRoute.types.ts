import type { FlatPagedResult } from '../../../shared/pagination';
import type {
  SeoResourceType,
  SeoScope,
  SortDirection,
} from "../constants/seoConstants";
import type { Nullable } from "./adminSeoMetadata.types";

// ==============================
// Slug Routes - Shared
// ==============================

export type AdminSlugRouteBase = {
  scope: string;
  slug: string;
  resourceType: string;
  resourcePublicId: string;
  canonicalUrl: Nullable<string>;
  isIndexable: boolean;
  isActive: boolean;
  sourceAggregateVersion: Nullable<number>;
  lastAppliedMessageId: Nullable<string>;
  lastSyncedAtUtc: Nullable<string>;
  version: number;
  createdAtUtc: string;
  createdByUserId: Nullable<number>;
  updatedAtUtc: string;
  updatedByUserId: Nullable<number>;
};

// ==============================
// GET /api/v1/admin/seo/slug-routes/{slugId}
// ==============================

export type AdminSlugRouteDetail = AdminSlugRouteBase & {
  slugId: number;
};

// ==============================
// GET /api/v1/admin/seo/slug-routes/by-resource
// ==============================

export type AdminSlugRouteByResource = AdminSlugRouteDetail;

// ==============================
// GET /api/v1/admin/seo/slug-routes
// ==============================

export type AdminSlugRouteListItem = AdminSlugRouteBase & {
  slugId: number;
};

export type AdminSlugRoutePagedResult = FlatPagedResult<AdminSlugRouteListItem>;

export type AdminSlugRouteFilter = {
  scope?: Nullable<SeoScope>;
  resourceType?: Nullable<SeoResourceType>;
  resourcePublicId?: Nullable<string>;
  isActive?: Nullable<boolean>;
  isIndexable?: Nullable<boolean>;
  keyword?: Nullable<string>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type AdminSlugRouteByResourceFilter = {
  resourceType: SeoResourceType;
  resourcePublicId: string;
  scope?: Nullable<SeoScope>;
  onlyActive?: Nullable<boolean>;
};

// ==============================
// GET /api/v1/admin/seo/slug-availability
// ==============================

export type CheckSlugAvailabilityRequest = {
  slug: string;
  scope?: Nullable<SeoScope>;
  resourceType?: Nullable<SeoResourceType>;
  resourcePublicId?: Nullable<string>;
};

export type CheckSlugAvailabilityResponse = {
  scope: string;
  slug: string;
  isAvailable: boolean;
  belongsToCurrentResource: boolean;
  existingResourceType: Nullable<string>;
  existingResourcePublicId: Nullable<string>;
  existingSlugId: Nullable<number>;
};

// ==============================
// POST /api/v1/admin/seo/generate-slug
// ==============================

export type GenerateSlugRequest = {
  source: string;
  scope?: Nullable<SeoScope>;
  resourceType?: Nullable<SeoResourceType>;
  resourcePublicId?: Nullable<string>;
};

export type GenerateSlugResponse = {
  scope: string;
  source: string;
  suggestedSlug: string;
  isUnique: boolean;
  existingResourceType: Nullable<string>;
  existingResourcePublicId: Nullable<string>;
};