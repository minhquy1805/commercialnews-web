"use client";

import Link from "next/link";
import { useRef } from "react";
import { Container } from "@/shared/components/ui/Container";
import { useDismissible } from "@/shared/hooks/useDismissible";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { usePublicHeaderState } from "./hooks/usePublicHeaderState";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const categories = [
  { label: "Technology", href: "/articles?category=technology" },
  { label: "Business", href: "/articles?category=business" },
  { label: "Cloud", href: "/articles?category=cloud" },
  { label: "Security", href: "/articles?category=security" },
  { label: "AI", href: "/articles?category=ai" },
];

export function PublicHeader() {
  const {
    isDesktopCategoriesOpen,
    isDesktopSearchOpen,
    isMobileMenuOpen,
    isMobileCategoriesOpen,
    openMobileMenu,
    closeMobileMenu,
    closeDesktopCategories,
    toggleDesktopCategories,
    toggleMobileCategories,
    handleDesktopSearchOpenChange,
  } = usePublicHeaderState();
  const desktopCategoriesRef = useRef<HTMLDivElement>(null);

  useDismissible(
    desktopCategoriesRef,
    closeDesktopCategories,
    isDesktopCategoriesOpen,
  );

  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <nav
          aria-label="Global"
          className="flex h-20 items-center justify-between"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="font-[var(--font-logo)] text-xl font-semibold italic tracking-tight text-slate-800 transition hover:text-slate-950 sm:text-2xl lg:text-3xl"
            >
              Commercial News
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={openMobileMenu}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="size-6"
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-12">
            <Link
              href="/articles"
              className="text-sm/6 font-semibold text-slate-900 transition hover:text-blue-600"
            >
              Latest
            </Link>

            <div ref={desktopCategoriesRef} className="relative">
              <button
                type="button"
                onClick={toggleDesktopCategories}
                className="flex items-center gap-x-1 text-sm/6 font-semibold text-slate-900 transition hover:text-blue-600"
                aria-expanded={isDesktopCategoriesOpen}
                aria-haspopup="menu"
              >
                Categories

                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`size-5 flex-none text-slate-400 transition ${
                    isDesktopCategoriesOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  />
                </svg>
              </button>

              {isDesktopCategoriesOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-screen max-w-xs -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-lg outline outline-1 outline-slate-900/5">
                  <div className="p-2">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        onClick={closeDesktopCategories}
                        className="block rounded-xl px-4 py-3 text-sm/6 font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <HeaderSearch
              isOpen={isDesktopSearchOpen}
              onOpenChange={handleDesktopSearchOpenChange}
            />
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
            {isCurrentUserLoading ? null : currentUser ? (
              <HeaderUserMenu currentUser={currentUser} />
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Register
                </Link>

                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:text-blue-600"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/20"
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 shadow-xl sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="font-[var(--font-logo)] text-xl font-semibold italic tracking-tight text-slate-800 transition hover:text-slate-950 sm:text-2xl"
              >
                Commercial News
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="-m-2.5 rounded-md p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span className="sr-only">Close menu</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-slate-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    href="/articles"
                    onClick={closeMobileMenu}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
                  >
                    Latest
                  </Link>

                  <div className="-mx-3">
                    <button
                      type="button"
                      onClick={toggleMobileCategories}
                      className="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
                    >
                      Categories

                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className={`size-5 flex-none transition ${
                          isMobileCategoriesOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        />
                      </svg>
                    </button>

                    {isMobileCategoriesOpen && (
                      <div className="mt-2 space-y-2">
                        {categories.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            onClick={closeMobileMenu}
                            className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <HeaderSearch
                      variant="mobile"
                      onSearchSubmitted={closeMobileMenu}
                    />
                  </div>
                </div>

                <div className="space-y-3 py-6">
                  {isCurrentUserLoading ? null : currentUser ? (
                    <HeaderUserMenu
                      currentUser={currentUser}
                      variant="mobile"
                      onNavigate={closeMobileMenu}
                    />
                  ) : (
                    <>
                      <Link
                        href="/register"
                        onClick={closeMobileMenu}
                        className="block rounded-full bg-slate-950 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-blue-600"
                      >
                        Register
                      </Link>

                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="block rounded-full border border-slate-400 px-4 py-3 text-center text-base font-semibold text-slate-900 transition hover:border-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      >
                        Sign in
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
