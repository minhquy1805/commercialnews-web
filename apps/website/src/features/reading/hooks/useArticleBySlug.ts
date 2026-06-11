"use client";

import { useQuery } from "@tanstack/react-query";
import { readingApi } from "../api/readingApi";

export function useArticleBySlug(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery({
    queryKey: ["reading", "articles", "slug", normalizedSlug],
    enabled: normalizedSlug.length > 0,
    queryFn: () => readingApi.getArticleBySlug(normalizedSlug),
    staleTime: 60 * 1000,
  });
}