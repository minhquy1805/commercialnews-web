import { httpClient } from "@/shared/api/httpClient";
import type { TrackArticleViewResponse } from "../types/interaction.types";

export const interactionApi = {
  trackArticleView(articlePublicId: string): Promise<TrackArticleViewResponse> {
    return httpClient
      .post<TrackArticleViewResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/views`,
      )
      .then((response) => response.data);
  },
};