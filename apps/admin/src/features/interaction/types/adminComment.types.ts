import type { PageInfoPagedResult, PageRequest } from '../../../shared/pagination';
import type {
  CommentModerationActionType,
  CommentStatus,
  ModerationReason,
} from '../constants/interactionConstants';

export type AdminCommentActorType = 'User' | 'Admin' | 'System' | string;

export type AdminCommentsFilter = PageRequest & {
  status?: CommentStatus;
  articlePublicId?: string;
  authorUserId?: number;
};

export type AdminCommentItem = {
  commentPublicId: string;
  articlePublicId: string;
  authorUserId: number;
  content: string;
  status: CommentStatus;
  parentCommentPublicId: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  deletedAtUtc: string | null;
  version: number;
};

export type AdminCommentDetail = {
  commentPublicId: string;
  articlePublicId: string;
  authorUserId: number;
  content: string;
  status: CommentStatus;
  parentCommentPublicId: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  deletedAtUtc: string | null;
  version: number;
};

export type HideAdminCommentRequest = {
  expectedVersion: number;
  reasonCode: ModerationReason;
  note?: string | null;
};

export type HideAdminCommentResponse = {
  commentPublicId: string;
  status: CommentStatus;
  version: number;
};

export type RestoreAdminCommentRequest = {
  expectedVersion: number;
  note?: string | null;
};

export type RestoreAdminCommentResponse = {
  commentPublicId: string;
  status: CommentStatus;
  version: number;
};

export type AdminCommentModerationHistoryFilter = PageRequest;

export type AdminCommentModerationHistoryItem = {
  historyPublicId: string;
  commentPublicId: string;
  commentModerationCasePublicId: string | null;
  actionType: CommentModerationActionType;
  fromStatus: CommentStatus | null;
  toStatus: CommentStatus | null;
  actorUserId: number | null;
  actorType: AdminCommentActorType;
  reasonCode: ModerationReason | null;
  note: string | null;
  occurredAtUtc: string;
  correlationId: string | null;
};

export type AdminCommentsResponse = PageInfoPagedResult<AdminCommentItem>;

export type AdminCommentModerationHistoryResponse =
  PageInfoPagedResult<AdminCommentModerationHistoryItem>;