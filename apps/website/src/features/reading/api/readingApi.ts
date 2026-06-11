import { httpClient } from "@/shared/api/httpClient";
import { DEFAULT_READING_SORT } from "../constants/readingSorts";
import type {
  ArticleDetailResponse,
  GetArticlesRequest,
  GetArticlesResponse,
  GetRelatedArticlesRequest,
  GetRelatedArticlesResponse,
  SearchArticlesRequest,
} from "../types/reading.types";

const READING_BASE_PATH = "/api/v1/reading";

export const readingApi = {
  getArticles(request: GetArticlesRequest = {}): Promise<GetArticlesResponse> {
    return httpClient
      .get<GetArticlesResponse>(`${READING_BASE_PATH}/articles`, {
        params: {
          page: request.page ?? 1,
          pageSize: request.pageSize ?? 10,
          categoryId: request.categoryId ?? undefined,
          tagId: request.tagId ?? undefined,
          keyword: request.keyword?.trim() || undefined,
          sort: request.sort || DEFAULT_READING_SORT,
        },
      })
      .then((response) => response.data);
  },

  searchArticles(
    request: SearchArticlesRequest,
  ): Promise<GetArticlesResponse> {
    return httpClient
      .get<GetArticlesResponse>(`${READING_BASE_PATH}/articles/search`, {
        params: {
          query: request.query.trim(),
          page: request.page ?? 1,
          pageSize: request.pageSize ?? 10,
          sort: request.sort || DEFAULT_READING_SORT,
        },
      })
      .then((response) => response.data);
  },

  getArticleBySlug(slug: string): Promise<ArticleDetailResponse> {
    return httpClient
      .get<ArticleDetailResponse>(
        `${READING_BASE_PATH}/articles/slug/${encodeURIComponent(slug)}`,
      )
      .then((response) => response.data);
  },

  getArticleByPublicId(
    articlePublicId: string,
  ): Promise<ArticleDetailResponse> {
    return httpClient
      .get<ArticleDetailResponse>(
        `${READING_BASE_PATH}/articles/${encodeURIComponent(articlePublicId)}`,
      )
      .then((response) => response.data);
  },

  getRelatedArticles(
    request: GetRelatedArticlesRequest,
  ): Promise<GetRelatedArticlesResponse> {
    return httpClient
      .get<GetRelatedArticlesResponse>(
        `${READING_BASE_PATH}/articles/${encodeURIComponent(
          request.articlePublicId,
        )}/related`,
        {
          params: {
            limit: request.limit ?? 4,
          },
        },
      )
      .then((response) => response.data);
  },
};