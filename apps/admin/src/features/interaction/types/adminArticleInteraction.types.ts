export type AdminArticleInteractionStats = {
  articlePublicId: string;
  viewCount: number;
  likeCount: number;
  visibleCommentCount: number;
  statsVersion: number;
  lastMaterializedAtUtc: string | null;
  lastPublishedAtUtc: string | null;
};