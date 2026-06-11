export const READING_SORTS = {
  OLDEST: "publishedAt",
  LATEST: "-publishedAt",
  LEAST_VIEWED: "viewCount",
  MOST_VIEWED: "-viewCount",
  LEAST_LIKED: "likeCount",
  MOST_LIKED: "-likeCount",
} as const;

export type ReadingSort = (typeof READING_SORTS)[keyof typeof READING_SORTS];

export const DEFAULT_READING_SORT = READING_SORTS.LATEST;