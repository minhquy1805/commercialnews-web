export type TrackArticleViewResponse = {
  accepted: boolean;
};

export type ArticleLikeStatusResponse = {
  articlePublicId: string;
  liked: boolean;
  version: number;
};

export type ToggleArticleLikeResponse = {
  articlePublicId: string;
  liked: boolean;
  version: number;
};

export type PublicCommentItemResponse = {
  commentPublicId: string;
  articlePublicId: string;
  content: string;
  createdAtUtc: string;
};

export type GetArticleCommentsResponse = {
  items: PublicCommentItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type CreateArticleCommentRequest = {
  content: string;
};

export type CreateArticleCommentResponse = {
  commentPublicId: string;
  articlePublicId: string;
  status: string;
  createdAtUtc: string;
  version: number;
};

export type ReportCommentRequest = {
  reasonCode: string;
  description: string | null;
};

export type ReportCommentResponse = {
  commentReportPublicId: string;
  commentPublicId: string;
  status: string;
  createdAtUtc: string;
};
