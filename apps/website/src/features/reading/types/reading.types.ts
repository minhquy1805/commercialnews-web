import type { ReadingSort } from "../constants/readingSorts";

export type ArticleCountersResponse = {
  views: number;
  likes: number;
  visibleCommentCount: number;
  countersPartial: boolean;
};

export type ArticleListItemResponse = {
  articlePublicId: string;
  slug: string;

  title: string;
  summary: string | null;

  categoryId: number | null;
  categoryName: string | null;

  authorUserId: number | null;
  authorDisplayName: string | null;

  coverMediaId: number | null;
  coverMediaUrl: string | null;
  coverAlt: string | null;

  publishedAtUtc: string | null;
  updatedAtUtc: string | null;

  counters: ArticleCountersResponse;
};

export type ArticleTagResponse = {
  tagId: number;
  tagPublicId: string;
  name: string;
  slug: string;
};

export type ArticleMediaResponse = {
  mediaId: number;
  mediaPublicId: string;
  url: string;
  alt: string | null;
  caption: string | null;
  mediaType: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ArticleDetailResponse = {
  articlePublicId: string;
  slug: string;

  title: string;
  summary: string | null;
  body: string;

  categoryId: number | null;
  categoryName: string | null;

  authorUserId: number | null;
  authorDisplayName: string | null;

  coverMediaId: number | null;
  coverMediaUrl: string | null;
  coverAlt: string | null;

  canonicalUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImageUrl: string | null;
  robots: string | null;

  publishedAtUtc: string | null;
  updatedAtUtc: string | null;

  counters: ArticleCountersResponse;

  tags: ArticleTagResponse[];
  media: ArticleMediaResponse[];
};

export type GetArticlesRequest = {
  page?: number;
  pageSize?: number;
  categoryId?: number | null;
  tagId?: number | null;
  keyword?: string | null;
  sort?: ReadingSort | string | null;
};

export type SearchArticlesRequest = {
  query: string;
  page?: number;
  pageSize?: number;
  sort?: ReadingSort | string | null;
};

export type GetRelatedArticlesRequest = {
  articlePublicId: string;
  limit?: number;
};

export type GetArticlesResponse = {
  items: ArticleListItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type GetRelatedArticlesResponse = {
  items: ArticleListItemResponse[];
};

export type ReadingCategorySummary = {
  categoryId: number;
  categoryName: string;
};