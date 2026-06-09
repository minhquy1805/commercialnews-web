import { Container } from "@/shared/components/ui/Container";
import { SectionTitle } from "@/shared/components/ui/SectionTitle";
import { SmallArticleItem } from "@/features/reading/components/SmallArticleItem";
import type { ArticleSummary } from "@/features/reading/types/article";

type HomepageSection = {
  title: string;
  href: string;
  articles: ArticleSummary[];
};

const latestArticles: ArticleSummary[] = [
  {
    title: "Building modern applications with clean architecture",
    href: "/articles/building-modern-applications-with-clean-architecture",
    category: "Technology",
    summary:
      "A practical look at how clean architecture helps teams build maintainable software.",
    views: 1240,
    likes: 86,
  },
  {
    title: "Why cloud security matters for growing startups",
    href: "/articles/why-cloud-security-matters-for-growing-startups",
    category: "Cloud",
    summary:
      "Security decisions made early can shape the long-term reliability of a product.",
    views: 980,
    likes: 61,
  },
];

const popularReads: ArticleSummary[] = [
  {
    title: "AI is changing how developers write and review code",
    href: "/articles/ai-is-changing-how-developers-write-and-review-code",
    category: "AI",
    summary:
      "AI tools are becoming part of daily development workflows, from review to documentation.",
    views: 8400,
    likes: 430,
  },
  {
    title: "The business value of observability in production systems",
    href: "/articles/the-business-value-of-observability",
    category: "Business",
    summary:
      "Observability helps teams understand user behavior, failures, and system health.",
    views: 6200,
    likes: 318,
  },
];

const mostLiked: ArticleSummary[] = [
  {
    title: "Lessons from scaling a modular monolith",
    href: "/articles/lessons-from-scaling-a-modular-monolith",
    category: "Software Engineering",
    summary:
      "A modular monolith can be a strong architecture choice before moving to microservices.",
    views: 5100,
    likes: 720,
  },
  {
    title: "How developers can think more like product builders",
    href: "/articles/how-developers-can-think-more-like-product-builders",
    category: "Career",
    summary:
      "Great developers do not only write code; they understand users, value, and trade-offs.",
    views: 4700,
    likes: 690,
  },
];

const homepageSections: HomepageSection[] = [
  {
    title: "Latest Articles",
    href: "/articles?sort=-publishedAt",
    articles: latestArticles,
  },
  {
    title: "Popular Reads",
    href: "/articles?sort=-viewCount",
    articles: popularReads,
  },
  {
    title: "Most Liked",
    href: "/articles?sort=-likeCount",
    articles: mostLiked,
  },
];

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
        {homepageSections.map((section) => (
          <section key={section.title}>
            <SectionTitle title={section.title} href={section.href} />

            <div className="space-y-5">
              {section.articles.map((article) => (
                <SmallArticleItem key={article.href} article={article} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
