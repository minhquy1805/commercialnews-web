"use client";

import { READING_SORTS } from "../constants/readingSorts";
import { useArticles } from "./useArticles";
import { getUniqueArticleCategories } from "../utils/getUniqueArticleCategories";

export function useHeaderArticleCategories() {
  const articlesQuery = useArticles({
    page: 1,
    pageSize: 100,
    sort: READING_SORTS.LATEST,
  });

  const categories = getUniqueArticleCategories(articlesQuery.data?.items ?? []);

  return {
    categories,
    isLoading: articlesQuery.isLoading,
    isError: articlesQuery.isError,
  };
}