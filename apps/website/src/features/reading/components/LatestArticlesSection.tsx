"use client";

import { SectionTitle } from "@/shared/components/ui/SectionTitle";
import type { ReadingSort } from "../constants/readingSorts";
import { useArticles } from "../hooks/useArticles";
import { SmallArticleItem } from "./SmallArticleItem";

type LatestArticlesSectionProps = {
  title: string;
  href: string;
  sort: ReadingSort;
  pageSize?: number;
};

export function LatestArticlesSection({
  title,
  href,
  sort,
  pageSize = 2,
}: LatestArticlesSectionProps) {
  const articlesQuery = useArticles({
    page: 1,
    pageSize,
    sort,
  });

  const articles = articlesQuery.data?.items ?? [];

  return (
    <section>
      <SectionTitle title={title} href={href} />

      {articlesQuery.isLoading ? (
        <div className="space-y-5">
          <SmallArticleItemSkeleton />
          <SmallArticleItemSkeleton />
        </div>
      ) : null}

      {articlesQuery.isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">
            Could not load articles.
          </p>
        </div>
      ) : null}

      {!articlesQuery.isLoading && !articlesQuery.isError ? (
        <div className="space-y-5">
          {articles.length > 0 ? (
            articles.map((article) => (
              <SmallArticleItem
                key={article.articlePublicId}
                article={article}
              />
            ))
          ) : (
            <p className="text-sm font-medium text-slate-500">
              No articles found.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function SmallArticleItemSkeleton() {
  return (
    <div className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
      <div className="h-3 w-24 rounded-full bg-slate-200" />
      <div className="mt-3 h-5 w-11/12 rounded-full bg-slate-200" />
      <div className="mt-2 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />
      <div className="mt-4 flex gap-3">
        <div className="h-3 w-16 rounded-full bg-slate-100" />
        <div className="h-3 w-16 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}