"use client";

import { useQuery } from "@tanstack/react-query";
import { readingApi } from "../api/readingApi";
import type { GetArticlesRequest } from "../types/reading.types";
import { normalizeGetArticlesRequest } from "../utils/normalizeReadingQuery";

export function useArticles(request: GetArticlesRequest = {}) {
  const normalizedRequest = normalizeGetArticlesRequest(request);

  return useQuery({
    queryKey: ["reading", "articles", normalizedRequest],
    queryFn: () => readingApi.getArticles(normalizedRequest),
    staleTime: 60 * 1000,
  });
}