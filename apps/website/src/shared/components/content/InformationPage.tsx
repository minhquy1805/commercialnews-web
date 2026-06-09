import type { ReactNode } from "react";
import { Container } from "@/shared/components/ui/Container";

type InformationPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
};

type InformationSectionProps = {
  title: string;
  children: ReactNode;
};

export function InformationPage({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: InformationPageProps) {
  return (
    <Container className="py-12 md:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>

        {updatedAt ? (
          <p className="mt-4 text-sm font-medium text-slate-500">
            Last updated: {updatedAt}
          </p>
        ) : null}
      </header>

      <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="space-y-10">{children}</div>
      </div>
    </Container>
  );
}

export function InformationSection({
  title,
  children,
}: InformationSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}
