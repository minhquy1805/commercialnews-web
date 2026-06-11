"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getApiErrorDescription } from "@/shared/api/apiError";
import {
  COMMENT_REPORT_REASONS,
  commentReportReasonRequiresDescription,
  type CommentReportReasonCode,
} from "../constants/commentReportReasons";
import { useReportComment } from "../hooks/useReportComment";

type ReportCommentButtonProps = {
  commentPublicId: string;
};

export function ReportCommentButton({
  commentPublicId,
}: ReportCommentButtonProps) {
  const router = useRouter();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const [reasonCode, setReasonCode] =
    useState<CommentReportReasonCode>("Spam");
  const [description, setDescription] = useState("");

  const reportCommentMutation = useReportComment();

  const trimmedDescription = description.trim();
  const isDescriptionRequired =
    commentReportReasonRequiresDescription(reasonCode);

  const canSubmit =
    !reportCommentMutation.isPending &&
    (!isDescriptionRequired || trimmedDescription.length > 0);

  const resetForm = () => {
    setReasonCode("Spam");
    setDescription("");
  };

  const handleOpen = () => {
    if (isCurrentUserLoading) {
      return;
    }

    if (!currentUser) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    reportCommentMutation.reset();
    setIsOpen(true);
  };

  const handleClose = () => {
    if (reportCommentMutation.isPending) {
      return;
    }

    setIsOpen(false);
    reportCommentMutation.reset();
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    reportCommentMutation.mutate(
      {
        commentPublicId,
        reasonCode,
        description: trimmedDescription.length > 0 ? trimmedDescription : null,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          resetForm();

          void Swal.fire({
            icon: "success",
            title: "Report submitted",
            text: "Thank you. We will review this comment.",
            confirmButtonText: "OK",
            confirmButtonColor: "#020617",
          });
        },
        onError: (error) => {
          void Swal.fire({
            icon: "error",
            title: "Report failed",
            text: getApiErrorDescription(
              error,
              "Could not submit your report. Please try again.",
            ),
            confirmButtonText: "OK",
            confirmButtonColor: "#020617",
          });
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs font-semibold text-slate-500 transition hover:text-red-600"
      >
        Report
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close report dialog"
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/40"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
                Report comment
              </p>

              <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Tell us what is wrong
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Reports help moderators review comments that may violate
                community rules.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor={`reportReason-${commentPublicId}`}
                  className="text-sm font-semibold text-slate-800"
                >
                  Reason
                </label>

                <select
                  id={`reportReason-${commentPublicId}`}
                  value={reasonCode}
                  onChange={(event) =>
                    setReasonCode(event.target.value as CommentReportReasonCode)
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-950"
                >
                  {COMMENT_REPORT_REASONS.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`reportDescription-${commentPublicId}`}
                  className="text-sm font-semibold text-slate-800"
                >
                  Description{" "}
                  {isDescriptionRequired ? (
                    <span className="text-red-600">*</span>
                  ) : null}
                </label>

                <textarea
                  id={`reportDescription-${commentPublicId}`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder={
                    isDescriptionRequired
                      ? "Please describe the issue..."
                      : "Optional: add more details for moderators..."
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />

                {isDescriptionRequired && trimmedDescription.length === 0 ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    Description is required when the reason is Other.
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {trimmedDescription.length}/1000 characters
                  </p>
                )}
              </div>

              {reportCommentMutation.isError ? (
                <p className="text-sm font-medium text-red-600">
                  {getApiErrorDescription(
                    reportCommentMutation.error,
                    "Could not submit your report. Please try again.",
                  )}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={reportCommentMutation.isPending}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reportCommentMutation.isPending
                    ? "Submitting..."
                    : "Submit report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
