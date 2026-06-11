"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

export function useUnlikeArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articlePublicId: string) =>
      interactionApi.unlikeArticle(articlePublicId),

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