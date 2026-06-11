"use client";

import { useQuery } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

type UseArticleCommentsOptions = {
  page?: number;
  pageSize?: number;
  sortDirection?: "ASC" | "DESC";
};

export function useArticleComments(
  articlePublicId: string,
  options: UseArticleCommentsOptions = {},
) {
  const normalizedArticlePublicId = articlePublicId.trim();

  return useQuery({
    queryKey: [
      "interaction",
      "articles",
      normalizedArticlePublicId,
      "comments",
      options,
    ],
    enabled: normalizedArticlePublicId.length > 0,
    queryFn: () =>
      interactionApi.getArticleComments(normalizedArticlePublicId, options),
    staleTime: 30 * 1000,
  });
}