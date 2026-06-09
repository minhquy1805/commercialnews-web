"use client";

import Link from "next/link";
import { useState } from "react";
import type { CurrentUserResponse } from "@/features/auth/types/auth.types";
import { useLogout } from "@/features/auth/hooks/useLogout";
import Image from "next/image";

type HeaderUserMenuProps = {
  currentUser: CurrentUserResponse;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

function getDisplayName(currentUser: CurrentUserResponse) {
  return currentUser.fullName?.trim() || currentUser.email;
}

function getAvatarInitial(currentUser: CurrentUserResponse) {
  return getDisplayName(currentUser).charAt(0).toUpperCase();
}

export function HeaderUserMenu({
  currentUser,
  variant = "desktop",
  onNavigate,
}: HeaderUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoading } = useLogout();

  const displayName = getDisplayName(currentUser);
  const avatarInitial = getAvatarInitial(currentUser);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    onNavigate?.();
  };

  const handleNavigate = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  if (variant === "mobile") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          {currentUser.avatarUrl ? (
            <Image
              src={currentUser.avatarUrl}
              alt={displayName}
              width={44}
              height={44}
              className="size-11 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
              {avatarInitial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-500">
              {currentUser.email}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            href="/profile"
            onClick={handleNavigate}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-blue-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="size-4"
            >
              <path
                d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="size-4"
            >
              <path
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 12h8.25m0 0-3-3m3 3-3 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLoading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pr-2.5 pl-1.5 transition hover:border-slate-300 hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {currentUser.avatarUrl ? (
          <Image
            src={currentUser.avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {avatarInitial}
          </div>
        )}

        <span className="max-w-28 truncate text-sm font-semibold text-slate-800">
          {displayName}
        </span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          className={`size-4 text-slate-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="m6 9 6 6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10">
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-950">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {currentUser.email}
            </p>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              onClick={handleNavigate}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
                className="size-4"
              >
                <path
                  d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
                className="size-4"
              >
                <path
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 12h8.25m0 0-3-3m3 3-3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isLoading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}