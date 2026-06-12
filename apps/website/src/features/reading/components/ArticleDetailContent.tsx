import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ArticleLikeButton } from "@/features/interaction/components/ArticleLikeButton";
import type {
  ArticleDetailResponse,
  ArticleMediaResponse,
} from "../types/reading.types";
import { formatCompactNumber } from "../utils/formatCompactNumber";

type ArticleDetailContentProps = {
  article: ArticleDetailResponse;
};

function formatDate(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function renderBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function distributeMediaAcrossParagraphs(
  mediaItems: ArticleMediaResponse[],
  paragraphCount: number,
) {
  const mediaByParagraph = new Map<number, ArticleMediaResponse[]>();

  if (paragraphCount === 0) {
    return mediaByParagraph;
  }

  mediaItems.forEach((media, mediaIndex) => {
    const paragraphIndex = Math.min(
      Math.ceil(
        ((mediaIndex + 1) * paragraphCount) / (mediaItems.length + 1),
      ) - 1,
      paragraphCount - 1,
    );
    const items = mediaByParagraph.get(paragraphIndex) ?? [];

    items.push(media);
    mediaByParagraph.set(paragraphIndex, items);
  });

  return mediaByParagraph;
}

export function ArticleDetailContent({ article }: ArticleDetailContentProps) {
  const paragraphs = renderBody(article.body);
  const inlineMedia = article.media
    .filter(
      (media) =>
        !media.isPrimary && media.mediaId !== article.coverMediaId,
    )
    .sort((first, second) => first.sortOrder - second.sortOrder);
  const mediaByParagraph = distributeMediaAcrossParagraphs(
    inlineMedia,
    paragraphs.length,
  );

  return (
    <article className="mx-auto max-w-3xl">
      <div>
        <Link
          href={`/articles?categoryId=${article.categoryId ?? ""}&sort=-publishedAt`}
          className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 transition hover:text-blue-700"
        >
          {article.categoryName ?? "General"}
        </Link>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {article.title}
        </h1>

        {article.summary ? (
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {article.summary}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
            <span className="font-semibold text-slate-700">
              {article.authorDisplayName ?? "Commercial News"}
            </span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAtUtc ?? undefined}>
              {formatDate(article.publishedAtUtc)}
            </time>
            <span aria-hidden="true">•</span>
            <span>{formatCompactNumber(article.counters.views)} views</span>
          </div>

          <ArticleLikeButton
            key={article.articlePublicId}
            articlePublicId={article.articlePublicId}
            likeCount={article.counters.likes}
          />
        </div>
      </div>

      {article.coverMediaUrl ? (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <Image
            src={article.coverMediaUrl}
            alt={article.coverAlt ?? article.title}
            width={960}
            height={540}
            priority
            className="aspect-video w-full object-cover"
          />

          {article.coverAlt ? (
            <figcaption className="border-t border-slate-200 bg-white px-4 py-2.5 text-sm font-normal leading-6 text-slate-500">
              {article.coverAlt}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="mt-9 space-y-6 text-[1.0625rem] leading-8 text-slate-700">
        {paragraphs.map((paragraph, paragraphIndex) => (
          <Fragment key={`${article.articlePublicId}-${paragraphIndex}`}>
            <p>{paragraph}</p>

            {mediaByParagraph.get(paragraphIndex)?.map((media) => (
              <InlineArticleMedia key={media.mediaPublicId} media={media} />
            ))}
          </Fragment>
        ))}
      </div>

      {article.tags.length > 0 ? (
        <div className="mt-9 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          {article.tags.map((tag) => (
            <Link
              key={tag.tagPublicId ?? tag.tagId}
              href={`/articles?tagId=${tag.tagId}&sort=-publishedAt`}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

type InlineArticleMediaProps = {
  media: ArticleMediaResponse;
};

function InlineArticleMedia({ media }: InlineArticleMediaProps) {
  const mediaType = media.mediaType.toLowerCase();

  if (mediaType.includes("image")) {
    return (
      <figure className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <Image
          src={media.url}
          alt={media.alt ?? "Article illustration"}
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
        />

        {media.caption || media.alt ? (
          <figcaption className="border-t border-slate-200 bg-white px-4 py-2.5 text-sm font-normal leading-6 text-slate-500">
            {media.caption || media.alt}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (mediaType.includes("video")) {
    return (
      <figure className="mx-auto max-w-2xl overflow-hidden rounded-xl bg-slate-950">
        <video
          src={media.url}
          controls
          className="aspect-video w-full bg-slate-950"
        />

        {media.caption ? (
          <figcaption className="px-4 py-2.5 text-sm leading-6 text-slate-300">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <a
      href={media.url}
      target="_blank"
      rel="noreferrer"
      className="mx-auto block max-w-2xl rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
    >
      {media.caption || media.alt || "Open attached file"}
    </a>
  );
}
