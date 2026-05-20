import type {
  AdminMediaAssetSortDirection,
  AdminMediaAssetType,
} from '../types/adminMediaAsset.types';

export const ADMIN_MEDIA_TYPES = {
  IMAGE: 'Image',
  VIDEO: 'Video',
  FILE: 'File',
} as const satisfies Record<string, AdminMediaAssetType>;

export const ADMIN_MEDIA_TYPE_OPTIONS: Array<{
  label: string;
  value: AdminMediaAssetType;
}> = [
  {
    label: 'Image',
    value: ADMIN_MEDIA_TYPES.IMAGE,
  },
  {
    label: 'Video',
    value: ADMIN_MEDIA_TYPES.VIDEO,
  },
  {
    label: 'File',
    value: ADMIN_MEDIA_TYPES.FILE,
  },
];

export const ADMIN_MEDIA_SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const satisfies Record<string, AdminMediaAssetSortDirection>;

export const ADMIN_MEDIA_DELETED_STATUS_OPTIONS: Array<{
  label: string;
  value: boolean | null;
}> = [
  {
    label: 'All',
    value: null,
  },
  {
    label: 'Active',
    value: false,
  },
  {
    label: 'Deleted',
    value: true,
  },
];

export const ADMIN_MEDIA_DEFAULT_PAGE = 1;

export const ADMIN_MEDIA_DEFAULT_PAGE_SIZE = 20;

export const ADMIN_MEDIA_DEFAULT_SORT_BY = 'CreatedAt';

export const ADMIN_MEDIA_DEFAULT_SORT_DIRECTION =
  ADMIN_MEDIA_SORT_DIRECTIONS.DESC;

export const ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE = 1;

export const ADMIN_ARTICLE_MEDIA_DEFAULT_PAGE_SIZE = 20;

export const ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_BY = 'SortOrder';

export const ADMIN_ARTICLE_MEDIA_DEFAULT_SORT_DIRECTION =
  ADMIN_MEDIA_SORT_DIRECTIONS.ASC;

export const ADMIN_MEDIA_UPLOAD_FORM_FIELD_NAMES = {
  FILE: 'file',
  MEDIA_TYPE: 'mediaType',
  ALT_TEXT: 'altText',
  METADATA_JSON: 'metadataJson',
  FOLDER: 'folder',
} as const;

export const ADMIN_MEDIA_PREVIEW_FALLBACK_TEXT = 'No preview available';
