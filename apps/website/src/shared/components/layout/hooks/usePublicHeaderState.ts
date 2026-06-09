"use client";

import { useDisclosure } from "@/shared/hooks/useDisclosure";

export function usePublicHeaderState() {
  const desktopCategories = useDisclosure();
  const desktopSearch = useDisclosure();
  const mobileMenu = useDisclosure();
  const mobileCategories = useDisclosure();

  const toggleDesktopCategories = () => {
    const nextIsOpen = !desktopCategories.isOpen;

    desktopCategories.setIsOpen(nextIsOpen);

    if (nextIsOpen) {
      desktopSearch.close();
    }
  };

  const handleDesktopSearchOpenChange = (isOpen: boolean) => {
    desktopSearch.setIsOpen(isOpen);

    if (isOpen) {
      desktopCategories.close();
    }
  };

  const closeMobileMenu = () => {
    mobileMenu.close();
    mobileCategories.close();
  };

  return {
    isDesktopCategoriesOpen: desktopCategories.isOpen,
    isDesktopSearchOpen: desktopSearch.isOpen,
    isMobileMenuOpen: mobileMenu.isOpen,
    isMobileCategoriesOpen: mobileCategories.isOpen,
    openMobileMenu: mobileMenu.open,
    closeMobileMenu,
    closeDesktopCategories: desktopCategories.close,
    toggleDesktopCategories,
    toggleMobileCategories: mobileCategories.toggle,
    handleDesktopSearchOpenChange,
  };
}
