"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UseHeaderSearchOptions = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onSearchSubmitted?: () => void;
};

export function useHeaderSearch({
  isOpen,
  onOpenChange,
  onSearchSubmitted,
}: UseHeaderSearchOptions = {}) {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [internalIsSearchOpen, setInternalIsSearchOpen] = useState(false);

  const isControlled = typeof isOpen === "boolean";
  const isSearchOpen = isControlled ? isOpen : internalIsSearchOpen;

  const setSearchOpen = (nextIsOpen: boolean) => {
    if (!isControlled) {
      setInternalIsSearchOpen(nextIsOpen);
    }

    onOpenChange?.(nextIsOpen);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const handleKeywordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setKeyword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    const params = new URLSearchParams({
      keyword: trimmedKeyword,
      sort: "-publishedAt",
      page: "1",
    });

    router.push(`/articles?${params.toString()}`);

    setKeyword("");
    closeSearch();
    onSearchSubmitted?.();
  };

  return {
    keyword,
    isSearchOpen,
    closeSearch,
    handleKeywordChange,
    handleSubmit,
    toggleSearch,
  };
}