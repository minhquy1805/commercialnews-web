import Link from "next/link";

type SectionTitleProps = {
  title: string;
  href?: string;
  actionLabel?: string;
};

export function SectionTitle({
  title,
  href,
  actionLabel = "View all",
}: SectionTitleProps) {
  return (
    <div className="mb-5 border-b border-slate-200 pb-3">
      <div className="flex items-center justify-between gap-4">
        {href ? (
          <Link
            href={href}
            className="text-xl font-bold tracking-tight text-slate-950 transition hover:text-blue-600"
          >
            {title}
          </Link>
        ) : (
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            {title}
          </h2>
        )}

        {href ? (
          <Link
            href={href}
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}