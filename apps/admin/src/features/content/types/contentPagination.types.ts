import type { PageInfo, PageInfoPagedResult } from '../../../shared/pagination';

export type ContentPageInfo = PageInfo & {
  totalPages: number;
};

export type ContentPagedResponse<T> = PageInfoPagedResult<T> & {
  pageInfo: ContentPageInfo;
};
