"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { useTrackArticleView } from "@/features/interaction/hooks/useTrackArticleView";
import { useArticleBySlug } from "../hooks/useArticleBySlug";
import { ArticleDetailContent } from "./ArticleDetailContent";
import { RelatedArticlesSection } from "./RelatedArticlesSection";
import { ArticleCommentsSection } from "@/features/interaction/components/ArticleCommentsSection";

type ArticleDetailPageContentProps = {
  slug: string;
};

export function ArticleDetailPageContent({
  slug,
}: ArticleDetailPageContentProps) {
  const articleQuery = useArticleBySlug(slug);
  const trackArticleViewMutation = useTrackArticleView();
  const trackedArticlePublicIdRef = useRef<string | null>(null);

  const article = articleQuery.data;

  useEffect(() => {
    if (!article?.articlePublicId) {
      return;
    }

    if (trackedArticlePublicIdRef.current === article.articlePublicId) {
      return;
    }

    trackedArticlePublicIdRef.current = article.articlePublicId;

    trackArticleViewMutation.mutate(article.articlePublicId);
  }, [article?.articlePublicId, trackArticleViewMutation]);

  if (articleQuery.isLoading) {
    return (
      <Container className="py-12 md:py-16">
        <ArticleDetailSkeleton />
      </Container>
    );
  }

  if (articleQuery.isError || !article) {
    return (
      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Article not found
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-red-950">
            We could not load this article.
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            The article may have been removed, unpublished, or the link may be
            incorrect.
          </p>

          <Link
            href="/articles"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Back to articles
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <ArticleDetailContent article={article} />

      <ArticleCommentsSection
        articlePublicId={article.articlePublicId}
        initialCommentCount={article.counters.visibleCommentCount}
      />

      <div className="mt-12">
        <RelatedArticlesSection articlePublicId={article.articlePublicId} />
      </div>
    </Container>
  );
}

function ArticleDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="h-4 w-28 rounded-full bg-slate-200" />
      <div className="mt-5 h-9 w-4/5 rounded-full bg-slate-200" />
      <div className="mt-3 h-9 w-3/5 rounded-full bg-slate-200" />
      <div className="mt-5 h-5 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-5 w-5/6 rounded-full bg-slate-100" />
      <div className="mt-8 aspect-video w-full rounded-2xl bg-slate-100" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded-full bg-slate-100" />
        <div className="h-4 w-full rounded-full bg-slate-100" />
        <div className="h-4 w-11/12 rounded-full bg-slate-100" />
        <div className="h-4 w-10/12 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
