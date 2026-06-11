"use client";

import { SectionTitle } from "@/shared/components/ui/SectionTitle";
import { useRelatedArticles } from "../hooks/useRelatedArticles";
import { SmallArticleItem } from "./SmallArticleItem";

type RelatedArticlesSectionProps = {
  articlePublicId: string;
};

export function RelatedArticlesSection({
  articlePublicId,
}: RelatedArticlesSectionProps) {
  const relatedArticlesQuery = useRelatedArticles(articlePublicId, 4);

  if (relatedArticlesQuery.isLoading) {
    return (
      <section className="mx-auto max-w-4xl">
        <SectionTitle title="Related articles" href="/articles" />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Loading related articles...
          </p>
        </div>
      </section>
    );
  }

  if (relatedArticlesQuery.isError) {
    return null;
  }

  const articles = relatedArticlesQuery.data?.items ?? [];

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <SectionTitle title="Related articles" href="/articles" />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          {articles.map((article) => (
            <SmallArticleItem key={article.articlePublicId} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}