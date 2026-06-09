import type { ReactNode } from "react";
import Link from "next/link";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <section className="bg-slate-50">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8 lg:py-12">
        <Link
          href="/"
          className="mb-6 font-[var(--font-logo)] text-3xl font-semibold italic tracking-tight text-slate-800 transition hover:text-slate-950"
        >
          Commercial News
        </Link>

        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm sm:max-w-md">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-950 md:text-2xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            ) : null}

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
