import { httpClient } from "@/shared/api/httpClient";
import type {
  ArticleLikeStatusResponse,
  ToggleArticleLikeResponse,
  TrackArticleViewResponse,
  CreateArticleCommentRequest,
  CreateArticleCommentResponse,
  GetArticleCommentsResponse,
  ReportCommentRequest,
  ReportCommentResponse,
} from "../types/interaction.types";

export const interactionApi = {
  trackArticleView(articlePublicId: string): Promise<TrackArticleViewResponse> {
    return httpClient
      .post<TrackArticleViewResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/views`,
      )
      .then((response) => response.data);
  },

  getMyArticleLike(
    articlePublicId: string,
  ): Promise<ArticleLikeStatusResponse> {
    return httpClient
      .get<ArticleLikeStatusResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/my-like`,
      )
      .then((response) => response.data);
  },

  likeArticle(articlePublicId: string): Promise<ToggleArticleLikeResponse> {
    return httpClient
      .post<ToggleArticleLikeResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/likes`,
      )
      .then((response) => response.data);
  },

  unlikeArticle(articlePublicId: string): Promise<ToggleArticleLikeResponse> {
    return httpClient
      .delete<ToggleArticleLikeResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/likes`,
      )
      .then((response) => response.data);
  },

  getArticleComments(
    articlePublicId: string,
    request: {
      page?: number;
      pageSize?: number;
      sortDirection?: "ASC" | "DESC";
    } = {},
  ): Promise<GetArticleCommentsResponse> {
    return httpClient
      .get<GetArticleCommentsResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/comments`,
        {
          params: {
            page: request.page ?? 1,
            pageSize: request.pageSize ?? 10,
            sortDirection: request.sortDirection ?? "DESC",
          },
        },
      )
      .then((response) => response.data);
  },

  createArticleComment(
    articlePublicId: string,
    request: CreateArticleCommentRequest,
  ): Promise<CreateArticleCommentResponse> {
    return httpClient
      .post<CreateArticleCommentResponse>(
        `/api/v1/articles/${encodeURIComponent(articlePublicId)}/comments`,
        request,
      )
      .then((response) => response.data);
  },

  reportComment(
    commentPublicId: string,
    request: ReportCommentRequest,
  ): Promise<ReportCommentResponse> {
    return httpClient
      .post<ReportCommentResponse>(
        `/api/v1/comments/${encodeURIComponent(commentPublicId)}/reports`,
        request,
      )
      .then((response) => response.data);
  },
};
