import { ArticleDetailPageContent } from "@/features/reading/components/ArticleDetailPageContent";

type ArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;

  return <ArticleDetailPageContent slug={slug} />;
}