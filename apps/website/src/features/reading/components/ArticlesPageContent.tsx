"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/shared/components/ui/Container";
import {
  DEFAULT_READING_SORT,
  READING_SORTS,
  type ReadingSort,
} from "../constants/readingSorts";
import { useArticles } from "../hooks/useArticles";
import { SmallArticleItem } from "./SmallArticleItem";

const ARTICLE_PAGE_SIZE = 10;

const SORT_OPTIONS: Array<{
  label: string;
  value: ReadingSort;
}> = [
  {
    label: "Newest first",
    value: READING_SORTS.LATEST,
  },
  {
    label: "Oldest first",
    value: READING_SORTS.OLDEST,
  },
  {
    label: "Most viewed",
    value: READING_SORTS.MOST_VIEWED,
  },
  {
    label: "Most liked",
    value: READING_SORTS.MOST_LIKED,
  },
];

function parsePositiveNumber(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

function isReadingSort(value: string | null): value is ReadingSort {
  if (!value) {
    return false;
  }

  return Object.values(READING_SORTS).includes(value as ReadingSort);
}

export function ArticlesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parsePositiveNumber(searchParams.get("page"), 1);
  const categoryId = parsePositiveNumber(searchParams.get("categoryId"), 0);
  const normalizedCategoryId = categoryId > 0 ? categoryId : null;
  const tagId = parsePositiveNumber(searchParams.get("tagId"), 0);
  const normalizedTagId = tagId > 0 ? tagId : null;
  const keyword = searchParams.get("keyword")?.trim() || null;

  const sortParam = searchParams.get("sort");
  const sort = isReadingSort(sortParam) ? sortParam : DEFAULT_READING_SORT;

  const articlesQuery = useArticles({
    page,
    pageSize: ARTICLE_PAGE_SIZE,
    sort,
    categoryId: normalizedCategoryId,
    tagId: normalizedTagId,
    keyword,
  });

  const articles = articlesQuery.data?.items ?? [];
  const totalPages = Math.max(articlesQuery.data?.totalPages ?? 1, 1);
  const totalItems = articlesQuery.data?.totalItems ?? 0;

  const updateSearchParams = (nextValues: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const queryString = params.toString();

    router.push(queryString ? `/articles?${queryString}` : "/articles");
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({
      sort: event.target.value,
      page: "1",
      categoryId: normalizedCategoryId ? String(normalizedCategoryId) : null,
      tagId: normalizedTagId ? String(normalizedTagId) : null,
      keyword,
    });
  };

  const goToPage = (nextPage: number) => {
    updateSearchParams({
      page: String(nextPage),
      sort,
      categoryId: normalizedCategoryId ? String(normalizedCategoryId) : null,
      tagId: normalizedTagId ? String(normalizedTagId) : null,
      keyword,
    });
  };

  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Reading
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {keyword ? `Search results for "${keyword}"` : "Articles"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {keyword
              ? "Browse articles matching your search keyword."
              : "Browse the latest stories about technology, business, cloud, security, and artificial intelligence."}
          </p>
        </div>

        <div className="w-full md:w-56">
          <label
            htmlFor="articleSort"
            className="text-sm font-semibold text-slate-700"
          >
            Sort by
          </label>

          <select
            id="articleSort"
            value={sort}
            onChange={handleSortChange}
            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-950"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="mt-8">
        {articlesQuery.isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <ArticleListSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {articlesQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">
              Could not load articles.
            </p>
          </div>
        ) : null}

        {!articlesQuery.isLoading && !articlesQuery.isError ? (
          <>
            <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
              <p>
                <span className="font-semibold text-slate-950">
                  {totalItems}
                </span>{" "}
                articles found
              </p>

              <p>
                Page{" "}
                <span className="font-semibold text-slate-950">{page}</span> of{" "}
                <span className="font-semibold text-slate-950">
                  {totalPages}
                </span>
              </p>
            </div>

            {articles.length > 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-5">
                  {articles.map((article) => (
                    <SmallArticleItem
                      key={article.articlePublicId}
                      article={article}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-medium text-slate-500">
                  No articles found.
                </p>
              </div>
            )}

            <ArticlePagination
              currentPage={page}
              totalPages={totalPages}
              isFetching={articlesQuery.isFetching}
              onPageChange={goToPage}
              onRefresh={() => articlesQuery.refetch()}
            />
          </>
        ) : null}
      </section>
    </Container>
  );
}

type ArticlePaginationProps = {
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
};

function ArticlePagination({
  currentPage,
  totalPages,
  isFetching,
  onPageChange,
  onRefresh,
}: ArticlePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePrevious = () => {
    if (currentPage <= 1) {
      onRefresh();
      return;
    }

    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage >= totalPages) {
      onRefresh();
      return;
    }

    onPageChange(currentPage + 1);
  };

  return (
    <nav
      aria-label="Articles pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={isFetching}
        onClick={handlePrevious}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        Previous
      </button>

      {pages.map((pageNumber) => {
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            type="button"
            disabled={isFetching}
            onClick={() => {
              if (isActive) {
                onRefresh();
                return;
              }

              onPageChange(pageNumber);
            }}
            className={
              isActive
                ? "inline-flex size-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-80"
                : "inline-flex size-10 items-center justify-center rounded-xl border border-slate-300 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            }
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        disabled={isFetching}
        onClick={handleNext}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        Next
      </button>
    </nav>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
      <div className="h-3 w-24 rounded-full bg-slate-200" />
      <div className="mt-3 h-5 w-2/3 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
      <div className="mt-4 flex gap-3">
        <div className="h-3 w-16 rounded-full bg-slate-100" />
        <div className="h-3 w-16 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
