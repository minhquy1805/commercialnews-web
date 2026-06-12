import Link from "next/link";
import type { ArticleListItemResponse } from "@/features/reading/types/reading.types";
import { formatCompactNumber } from "@/features/reading/utils/formatCompactNumber";

type SmallArticleItemProps = {
  article: ArticleListItemResponse;
};

export function SmallArticleItem({ article }: SmallArticleItemProps) {
  return (
    <article className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {article.categoryName ?? "General"}
      </p>

      <h3 className="mt-2 text-base font-bold leading-6 text-slate-950">
        <Link
          href={`/articles/${article.slug}`}
          className="transition hover:text-blue-600"
        >
          {article.title}
        </Link>
      </h3>

      {article.summary ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {article.summary}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-4"
          >
            <path
              d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {formatCompactNumber(article.counters.views)} views
        </span>

        <span className="inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-4"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {formatCompactNumber(article.counters.likes)} likes
        </span>
      </div>
    </article>
  );
}
