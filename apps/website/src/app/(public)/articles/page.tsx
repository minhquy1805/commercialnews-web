import { Suspense } from "react";
import { ArticlesPageContent } from "@/features/reading/components/ArticlesPageContent";
import { Container } from "@/shared/components/ui/Container";

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticlesPageFallback />}>
      <ArticlesPageContent />
    </Suspense>
  );
}

function ArticlesPageFallback() {
  return (
    <Container className="py-12 md:py-16">
      <p className="text-sm font-medium text-slate-500">
        Loading articles...
      </p>
    </Container>
  );
}
