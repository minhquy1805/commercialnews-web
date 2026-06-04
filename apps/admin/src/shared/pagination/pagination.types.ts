export type PageRequest = {
  page?: number;
  pageSize?: number;
};

export type PageInfo = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

/**
 * Legacy paging shape.
 *
 * Một số module cũ vẫn có thể trả response dạng:
 * {
 *   items: [],
 *   page,
 *   pageSize,
 *   totalItems,
 *   totalPages?
 * }
 */
export type FlatPagedResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

/**
 * New backend paging shape.
 *
 * Backend mới trả:
 * {
 *   items: [],
 *   pageInfo: {
 *     page,
 *     pageSize,
 *     totalItems,
 *     totalPages
 *   }
 * }
 */
export type PageInfoPagedResult<TItem> = {
  items: TItem[];
  pageInfo: PageInfo;
};

export type PaginationFallback = {
  page: number;
  pageSize: number;
};

/**
 * Dùng cho createTablePagination/getPageInfo.
 *
 * Cố tình hỗ trợ cả:
 * - FlatPagedResult<T>
 * - PageInfoPagedResult<T>
 * - object chỉ có page/pageSize/totalItems
 * - object chỉ có pageInfo
 */
export type PaginationSource =
  | {
      page?: number;
      pageSize?: number;
      totalItems?: number;
      totalPages?: number;
      pageInfo?: Partial<PageInfo> | null;
    }
  | null
  | undefined;

export type PaginationChangeHandler = (
  page: number,
  pageSize: number,
) => void;

export type PaginationTotalRenderer = (
  total: number,
  range: [number, number],
) => string;

export type AdminTablePagination = {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: true;
  showTotal?: PaginationTotalRenderer;
  onChange: PaginationChangeHandler;
};