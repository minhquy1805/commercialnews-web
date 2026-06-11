"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { formatCompactNumber } from "@/features/reading/utils/formatCompactNumber";
import { useArticleLikeStatus } from "../hooks/useArticleLikeStatus";
import { useLikeArticle } from "../hooks/useLikeArticle";
import { useUnlikeArticle } from "../hooks/useUnlikeArticle";

type ArticleLikeButtonProps = {
  articlePublicId: string;
  likeCount: number;
};

export function ArticleLikeButton({
  articlePublicId,
  likeCount,
}: ArticleLikeButtonProps) {
  const router = useRouter();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const isAuthenticated = Boolean(currentUser);

  const likeStatusQuery = useArticleLikeStatus(
    articlePublicId,
    isAuthenticated,
  );

  const likeArticleMutation = useLikeArticle();
  const unlikeArticleMutation = useUnlikeArticle();

  const serverLiked = likeStatusQuery.data?.liked ?? false;

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);

  const displayedLiked = hasUserInteracted ? localLiked : serverLiked;
  const displayedLikeCount = hasUserInteracted ? localLikeCount : likeCount;

  const isPending =
    isCurrentUserLoading ||
    likeArticleMutation.isPending ||
    unlikeArticleMutation.isPending;

  const handleToggleLike = () => {
    if (isCurrentUserLoading) {
      return;
    }

    if (!currentUser) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    if (isPending) {
      return;
    }

    const previousLiked = displayedLiked;
    const previousLikeCount = displayedLikeCount;

    const nextLiked = !previousLiked;
    const nextLikeCount = nextLiked
      ? previousLikeCount + 1
      : Math.max(previousLikeCount - 1, 0);

    setHasUserInteracted(true);
    setLocalLiked(nextLiked);
    setLocalLikeCount(nextLikeCount);

    if (nextLiked) {
      likeArticleMutation.mutate(articlePublicId, {
        onError: () => {
          setLocalLiked(previousLiked);
          setLocalLikeCount(previousLikeCount);
        },
      });

      return;
    }

    unlikeArticleMutation.mutate(articlePublicId, {
      onError: () => {
        setLocalLiked(previousLiked);
        setLocalLikeCount(previousLikeCount);
      },
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggleLike}
      className={
        displayedLiked
          ? "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
          : "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-wait disabled:opacity-70"
      }
      aria-label={displayedLiked ? "Unlike article" : "Like article"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={displayedLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        className="size-4"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span>{displayedLiked ? "Liked" : "Like"}</span>

      <span>{formatCompactNumber(displayedLikeCount)}</span>
    </button>
  );
}