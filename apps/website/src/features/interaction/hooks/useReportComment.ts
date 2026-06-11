"use client";

import { useMutation } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

type ReportCommentVariables = {
  commentPublicId: string;
  reasonCode: string;
  description: string | null;
};

export function useReportComment() {
  return useMutation({
    mutationFn: ({
      commentPublicId,
      reasonCode,
      description,
    }: ReportCommentVariables) =>
      interactionApi.reportComment(commentPublicId, {
        reasonCode,
        description,
      }),
  });
}