"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

type CreateArticleCommentVariables = {
  articlePublicId: string;
  content: string;
};

export function useCreateArticleComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articlePublicId, content }: CreateArticleCommentVariables) =>
      interactionApi.createArticleComment(articlePublicId, {
        content,
      }),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          "interaction",
          "articles",
          response.articlePublicId,
          "comments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["reading"],
      });
    },
  });
}