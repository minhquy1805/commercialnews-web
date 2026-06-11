"use client";

import { useQuery } from "@tanstack/react-query";
import { readingApi } from "../api/readingApi";
import type { SearchArticlesRequest } from "../types/reading.types";
import { normalizeSearchArticlesRequest } from "../utils/normalizeReadingQuery";

export function useSearchArticles(request: SearchArticlesRequest) {
  const normalizedRequest = normalizeSearchArticlesRequest(request);

  return useQuery({
    queryKey: ["reading", "articles", "search", normalizedRequest],
    enabled: normalizedRequest.query.length > 0,
    queryFn: () => readingApi.searchArticles(normalizedRequest),
    staleTime: 30 * 1000,
  });
}