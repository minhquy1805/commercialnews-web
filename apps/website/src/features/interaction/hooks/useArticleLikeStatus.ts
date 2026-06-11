"use client";

import { useQuery } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

export function useArticleLikeStatus(
  articlePublicId: string,
  enabled: boolean,
) {
  const normalizedArticlePublicId = articlePublicId.trim();

  return useQuery({
    queryKey: ["interaction", "articles", normalizedArticlePublicId, "my-like"],
    enabled: enabled && normalizedArticlePublicId.length > 0,
    queryFn: () => interactionApi.getMyArticleLike(normalizedArticlePublicId),
    staleTime: 30 * 1000,
  });
}