"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

export function useLikeArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articlePublicId: string) =>
      interactionApi.likeArticle(articlePublicId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["interaction", "articles", response.articlePublicId, "my-like"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reading"],
      });
    },
  });
}