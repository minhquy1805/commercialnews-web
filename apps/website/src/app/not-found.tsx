import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/shared/components/layout/PublicShell";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Page Not Found | CommercialNews",
  description: "The requested page could not be found.",
};

export default function NotFoundPage() {
  return (
    <PublicShell>
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <section className="w-full max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Error 404
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            The page you are looking for may have been moved, deleted, or the
            address may be incorrect.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Back to homepage
            </Link>

            <Link
              href="/articles"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Browse articles
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="mx-auto mt-12 flex h-32 max-w-md items-center justify-center rounded-3xl border border-slate-200 bg-slate-50"
          >
            <span className="text-7xl font-bold tracking-tight text-slate-200">
              404
            </span>
          </div>
        </section>
      </Container>
    </PublicShell>
  );
}
