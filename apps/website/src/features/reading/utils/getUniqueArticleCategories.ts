import type {
  ArticleListItemResponse,
  ReadingCategorySummary,
} from "../types/reading.types";

export function getUniqueArticleCategories(
  articles: ArticleListItemResponse[],
): ReadingCategorySummary[] {
  const categoryMap = new Map<number, ReadingCategorySummary>();

  articles.forEach((article) => {
    if (!article.categoryId || !article.categoryName) {
      return;
    }

    if (categoryMap.has(article.categoryId)) {
      return;
    }

    categoryMap.set(article.categoryId, {
      categoryId: article.categoryId,
      categoryName: article.categoryName,
    });
  });

  return Array.from(categoryMap.values()).sort((first, second) =>
    first.categoryName.localeCompare(second.categoryName),
  );
}