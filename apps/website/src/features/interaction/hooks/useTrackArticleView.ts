"use client";

import { useMutation } from "@tanstack/react-query";
import { interactionApi } from "../api/interactionApi";

export function useTrackArticleView() {
  return useMutation({
    mutationFn: (articlePublicId: string) =>
      interactionApi.trackArticleView(articlePublicId),
  });
}