"use client";

import { useHeaderSearch } from "./hooks/useHeaderSearch";

type HeaderSearchProps = {
  variant?: "desktop" | "mobile";
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onSearchSubmitted?: () => void;
};

export function HeaderSearch({
  variant = "desktop",
  isOpen,
  onOpenChange,
  onSearchSubmitted,
}: HeaderSearchProps) {
  const {
    keyword,
    isSearchOpen,
    handleKeywordChange,
    handleSubmit,
    toggleSearch,
  } = useHeaderSearch({
    isOpen,
    onOpenChange,
    onSearchSubmitted,
  });

  if (variant === "mobile") {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile-header-search" className="sr-only">
          Search articles
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="size-5 text-slate-400"
            >
              <path
                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            id="mobile-header-search"
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Search articles..."
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 ps-11 pe-22 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={toggleSearch}
        className="text-sm/6 font-semibold text-slate-900 transition hover:text-blue-600"
        aria-expanded={isSearchOpen}
        aria-haspopup="dialog"
      >
        Search
      </button>

      {isSearchOpen ? (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-96 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <label
              htmlFor="desktop-header-search"
              className="sr-only mb-2.5 block text-sm font-medium text-slate-900"
            >
              Search
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="size-4 text-slate-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>

              <input
                id="desktop-header-search"
                type="search"
                value={keyword}
                onChange={handleKeywordChange}
                placeholder="Search"
                autoFocus
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 ps-9 pe-24 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:bg-white"
              />

              <button
                type="submit"
                className="absolute end-1.5 bottom-1.5 rounded-lg border border-transparent bg-slate-950 px-3 py-1.5 text-xs font-semibold leading-5 text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
