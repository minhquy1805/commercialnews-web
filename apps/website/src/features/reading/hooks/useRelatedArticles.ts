"use client";

import { useQuery } from "@tanstack/react-query";
import { readingApi } from "../api/readingApi";

export function useRelatedArticles(articlePublicId: string, limit = 4) {
  const normalizedArticlePublicId = articlePublicId.trim();

  return useQuery({
    queryKey: [
      "reading",
      "articles",
      normalizedArticlePublicId,
      "related",
      limit,
    ],
    enabled: normalizedArticlePublicId.length > 0,
    queryFn: () =>
      readingApi.getRelatedArticles({
        articlePublicId: normalizedArticlePublicId,
        limit,
      }),
    staleTime: 60 * 1000,
  });
}