export type ContentPageInfo = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ContentPagedResponse<T> = {
  items: T[];
  pageInfo: ContentPageInfo;
};