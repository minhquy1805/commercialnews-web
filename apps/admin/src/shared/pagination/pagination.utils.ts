import type {
  AdminTablePagination,
  PageInfo,
  PaginationChangeHandler,
  PaginationFallback,
  PaginationSource,
  PaginationTotalRenderer,
} from './pagination.types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

function normalizePositiveNumber(
  value: number | undefined,
  fallback: number,
) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

function normalizeNonNegativeNumber(
  value: number | undefined,
  fallback: number,
) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

function calculateTotalPages(totalItems: number, pageSize: number) {
  if (pageSize <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / pageSize);
}

export function getPageInfo(
  source: PaginationSource,
  fallback: PaginationFallback,
): PageInfo {
  const sourcePageInfo = source?.pageInfo ?? source;

  const page = normalizePositiveNumber(
    sourcePageInfo?.page,
    fallback.page,
  );

  const pageSize = normalizePositiveNumber(
    sourcePageInfo?.pageSize,
    fallback.pageSize,
  );

  const totalItems = normalizeNonNegativeNumber(
    sourcePageInfo?.totalItems,
    0,
  );

  const totalPages = normalizeNonNegativeNumber(
    sourcePageInfo?.totalPages,
    calculateTotalPages(totalItems, pageSize),
  );

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}

export function createTablePagination(
  source: PaginationSource,
  fallback: PaginationFallback,
  onChange: PaginationChangeHandler,
  showTotal?: PaginationTotalRenderer,
): AdminTablePagination {
  const pageInfo = getPageInfo(source, fallback);

  return {
    current: pageInfo.page,
    pageSize: pageInfo.pageSize,
    total: pageInfo.totalItems,
    showSizeChanger: true,
    ...(showTotal ? { showTotal } : {}),
    onChange,
  };
}