import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";

const footerLinks = [
  { label: "About us", href: "/about" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.25 22 17.08 22 12.06Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.53V9H7.1v11.45Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-6.4L6.45 22H3.33l7.25-8.29L2.93 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.84h1.72L8.39 4.05H6.54L17.8 19.84Z" />
      </svg>
    ),
  },
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="py-8 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center">
                <span className="font-[var(--font-logo)] text-2xl font-semibold italic tracking-tight text-slate-800">
                  Commercial News
                </span>
              </Link>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                A modern news platform for technology, business, cloud,
                security, and AI.
              </p>
            </div>

            <div className="flex flex-col gap-5 lg:items-end">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600 lg:justify-end">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-blue-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                <p className="text-sm font-semibold text-slate-700">
                  Follow us on social
                </p>

                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-slate-200 md:my-8" />

          <p className="text-sm text-slate-500 sm:text-center">
            © {currentYear}{" "}
            <Link href="/" className="font-medium hover:text-blue-600">
              Commercial News
            </Link>
            . All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}