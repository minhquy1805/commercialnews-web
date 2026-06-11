import { DEFAULT_READING_SORT } from "../constants/readingSorts";
import type {
  GetArticlesRequest,
  SearchArticlesRequest,
} from "../types/reading.types";

export function normalizeGetArticlesRequest(request: GetArticlesRequest = {}) {
  return {
    page: request.page ?? 1,
    pageSize: request.pageSize ?? 10,
    categoryId: request.categoryId ?? null,
    tagId: request.tagId ?? null,
    keyword: request.keyword?.trim() || null,
    sort: request.sort || DEFAULT_READING_SORT,
  };
}

export function normalizeSearchArticlesRequest(request: SearchArticlesRequest) {
  return {
    query: request.query.trim(),
    page: request.page ?? 1,
    pageSize: request.pageSize ?? 10,
    sort: request.sort || DEFAULT_READING_SORT,
  };
}