"use client";

import { useState } from "react";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
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
}: UseHeaderSearchOptions) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isInternalSearchOpen, setIsInternalSearchOpen] = useState(false);
  const isSearchOpen = isOpen ?? isInternalSearchOpen;

  const setSearchOpen = (nextIsOpen: boolean) => {
    if (isOpen === undefined) {
      setIsInternalSearchOpen(nextIsOpen);
    }

    onOpenChange?.(nextIsOpen);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const handleKeywordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setKeyword(event.target.value);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      router.push("/search");
      onSearchSubmitted?.();
      closeSearch();
      return;
    }

    router.push(`/search?query=${encodeURIComponent(trimmedKeyword)}`);
    onSearchSubmitted?.();
    closeSearch();
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
