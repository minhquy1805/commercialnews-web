"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useArticleComments } from "../hooks/useArticleComments";
import { useCreateArticleComment } from "../hooks/useCreateArticleComment";
import type { PublicCommentItemResponse } from "../types/interaction.types";
import { ReportCommentButton } from "./ReportCommentButton";

type ArticleCommentsSectionProps = {
  articlePublicId: string;
  initialCommentCount: number;
};

const COMMENT_PAGE_SIZE = 10;

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ArticleCommentsSection({
  articlePublicId,
  initialCommentCount,
}: ArticleCommentsSectionProps) {
  const router = useRouter();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");
  const [submittedComments, setSubmittedComments] = useState<
    PublicCommentItemResponse[]
  >([]);

  const commentsQuery = useArticleComments(articlePublicId, {
    page,
    pageSize: COMMENT_PAGE_SIZE,
    sortDirection: "DESC",
  });

  const createCommentMutation = useCreateArticleComment();

  const serverComments = commentsQuery.data?.items ?? [];
  const serverCommentIds = new Set(
    serverComments.map((comment) => comment.commentPublicId),
  );
  const localComments = submittedComments.filter(
    (comment) => !serverCommentIds.has(comment.commentPublicId),
  );
  const comments =
    page === 1 ? [...localComments, ...serverComments] : serverComments;
  const totalItems =
    (commentsQuery.data?.totalItems ?? initialCommentCount) +
    localComments.length;
  const totalPages = Math.max(
    commentsQuery.data?.totalPages ?? 1,
    Math.ceil(totalItems / COMMENT_PAGE_SIZE),
    1,
  );
  const submittedCommentIds = new Set(
    submittedComments.map((comment) => comment.commentPublicId),
  );
  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && trimmedContent.length <= 2000;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCurrentUserLoading) {
      return;
    }

    if (!currentUser) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    if (!canSubmit || createCommentMutation.isPending) {
      return;
    }

    createCommentMutation.mutate(
      {
        articlePublicId,
        content: trimmedContent,
      },
      {
        onSuccess: (response, variables) => {
          setSubmittedComments((currentComments) => [
            {
              commentPublicId: response.commentPublicId,
              articlePublicId: response.articlePublicId,
              content: variables.content,
              createdAtUtc: response.createdAtUtc,
            },
            ...currentComments.filter(
              (comment) =>
                comment.commentPublicId !== response.commentPublicId,
            ),
          ]);
          setContent("");
          setPage(1);
          void Swal.fire({
            icon: "success",
            title: "Comment posted",
            text: "Your comment has been posted successfully.",
            confirmButtonText: "OK",
            confirmButtonColor: "#020617",
          });
        },
      },
    );
  };

  return (
    <section className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Discussion
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Comments
          </h2>
        </div>

        <p className="text-sm font-semibold text-slate-500">
          {totalItems} comments
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label
          htmlFor="commentContent"
          className="text-sm font-semibold text-slate-800"
        >
          Join the discussion
        </label>

        <textarea
          id="commentContent"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            currentUser
              ? "Write a thoughtful comment..."
              : "Sign in to write a comment..."
          }
          rows={4}
          maxLength={2000}
          className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium text-slate-500">
            {trimmedContent.length}/2000 characters
          </p>

          <button
            type="submit"
            disabled={!canSubmit || createCommentMutation.isPending}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createCommentMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>

        {createCommentMutation.isError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            Could not submit your comment. Please try again.
          </p>
        ) : null}
      </form>

      <div className="mt-8">
        {commentsQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {commentsQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Could not load comments.
            </p>
          </div>
        ) : null}

        {!commentsQuery.isLoading && !commentsQuery.isError ? (
          <>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.commentPublicId}
                    comment={comment}
                    isOwn={submittedCommentIds.has(comment.commentPublicId)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-500">
                  No comments yet. Be the first to start the discussion.
                </p>
              </div>
            )}

            {totalPages > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || commentsQuery.isFetching}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm font-semibold text-slate-500">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || commentsQuery.isFetching}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

type CommentItemProps = {
  comment: PublicCommentItemResponse;
  isOwn?: boolean;
};

function CommentItem({ comment, isOwn = false }: CommentItemProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-950">Reader</p>

        <div className="flex items-center gap-3">
          <time
            dateTime={comment.createdAtUtc}
            className="text-xs font-medium text-slate-500"
          >
            {formatCommentDate(comment.createdAtUtc)}
          </time>

          {!isOwn ? (
            <ReportCommentButton commentPublicId={comment.commentPublicId} />
          ) : null}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {comment.content}
      </p>
    </article>
  );
}

function CommentSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded-full bg-slate-200" />
        <div className="h-3 w-28 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
    </div>
  );
}
