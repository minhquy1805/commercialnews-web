export const SEO_SCOPES = {
  PUBLIC: "public",
} as const;

export type SeoScope = (typeof SEO_SCOPES)[keyof typeof SEO_SCOPES];

export const SEO_RESOURCE_TYPES = {
  ARTICLE: "Article",
} as const;

export type SeoResourceType =
  (typeof SEO_RESOURCE_TYPES)[keyof typeof SEO_RESOURCE_TYPES];

export const SEO_APPLY_RESULTS = {
  APPLIED: "Applied",
  STALE_IGNORED: "StaleIgnored",
  NO_ROUTE_TO_ACTIVATE: "NoRouteToActivate",
  NO_ROUTE_TO_DEACTIVATE: "NoRouteToDeactivate",
  NOT_APPLIED: "NotApplied",
} as const;

export type SeoApplyResult =
  (typeof SEO_APPLY_RESULTS)[keyof typeof SEO_APPLY_RESULTS];

export const SEO_SORT_DIRECTIONS = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type SortDirection =
  (typeof SEO_SORT_DIRECTIONS)[keyof typeof SEO_SORT_DIRECTIONS];

export const SEO_DEFAULTS = {
  SCOPE: SEO_SCOPES.PUBLIC,
  RESOURCE_TYPE: SEO_RESOURCE_TYPES.ARTICLE,
  PAGE: 1,
  PAGE_SIZE: 20,
  SORT_BY: "UpdatedAtUtc",
  SORT_DIRECTION: SEO_SORT_DIRECTIONS.DESC,
} as const;

export const SEO_ROBOTS_OPTIONS = {
  INDEX_FOLLOW: "index,follow",
  NOINDEX_FOLLOW: "noindex,follow",
  INDEX_NOFOLLOW: "index,nofollow",
  NOINDEX_NOFOLLOW: "noindex,nofollow",
} as const;

export type SeoRobotsOption =
  (typeof SEO_ROBOTS_OPTIONS)[keyof typeof SEO_ROBOTS_OPTIONS];

export const SEO_ROBOTS_SELECT_OPTIONS = [
  {
    label: "Index, Follow",
    value: SEO_ROBOTS_OPTIONS.INDEX_FOLLOW,
  },
  {
    label: "Noindex, Follow",
    value: SEO_ROBOTS_OPTIONS.NOINDEX_FOLLOW,
  },
  {
    label: "Index, Nofollow",
    value: SEO_ROBOTS_OPTIONS.INDEX_NOFOLLOW,
  },
  {
    label: "Noindex, Nofollow",
    value: SEO_ROBOTS_OPTIONS.NOINDEX_NOFOLLOW,
  },
] as const;

export const SEO_SCOPE_SELECT_OPTIONS = [
  {
    label: "Public",
    value: SEO_SCOPES.PUBLIC,
  },
] as const;

export const SEO_RESOURCE_TYPE_SELECT_OPTIONS = [
  {
    label: "Article",
    value: SEO_RESOURCE_TYPES.ARTICLE,
  },
] as const;