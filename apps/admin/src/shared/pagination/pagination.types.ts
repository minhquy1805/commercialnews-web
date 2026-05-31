export type PageRequest = {
  page?: number;
  pageSize?: number;
};

export type PageInfo = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

export type FlatPagedResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

export type PageInfoPagedResult<TItem> = {
  items: TItem[];
  pageInfo: PageInfo;
};

export type PaginationFallback = {
  page: number;
  pageSize: number;
};

export type PaginationSource = {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  pageInfo?: Partial<PageInfo> | null;
} | null | undefined;

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
