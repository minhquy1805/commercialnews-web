import { Container } from "@/shared/components/ui/Container";
import { LatestArticlesSection } from "@/features/reading/components/LatestArticlesSection";
import { READING_SORTS } from "@/features/reading/constants/readingSorts";

export default function HomePage() {
  return (
    <Container className="py-12 md:py-16">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Commercial News
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Technology, business, and economic stories for modern builders.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Explore curated stories about technology, business, economics, cloud,
          cybersecurity, and artificial intelligence — built for readers who
          want to understand how digital products and markets evolve.
        </p>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <LatestArticlesSection
          title="Latest Articles"
          href="/articles?sort=-publishedAt"
          sort={READING_SORTS.LATEST}
        />

        <LatestArticlesSection
          title="Popular Reads"
          href="/articles?sort=-viewCount"
          sort={READING_SORTS.MOST_VIEWED}
        />

        <LatestArticlesSection
          title="Most Liked"
          href="/articles?sort=-likeCount"
          sort={READING_SORTS.MOST_LIKED}
        />
      </div>
    </Container>
  );
}