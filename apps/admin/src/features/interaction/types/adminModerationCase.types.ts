import type { PageInfoPagedResult, PageRequest } from '../../../shared/pagination';
import type {
  CommentReportReason,
  CommentReportStatus,
  CommentStatus,
  ModerationCasePriority,
  ModerationCaseResolutionType,
  ModerationCaseStatus,
  ModerationReason,
  ReportAlertLevel,
  ReportSeverity,
} from '../constants/interactionConstants';

export type AdminModerationCasesFilter = PageRequest & {
  status?: ModerationCaseStatus;
  priority?: ModerationCasePriority;
  articlePublicId?: string;
  commentPublicId?: string;
  alertTriggered?: boolean;
};

export type AdminModerationCaseItem = {
  commentModerationCasePublicId: string;
  commentPublicId: string;
  articlePublicId: string;
  status: ModerationCaseStatus;
  priority: ModerationCasePriority;
  highestSeverity: ReportSeverity;
  pendingReportCount: number;
  distinctReporterCount: number;
  alertTriggered: boolean;
  alertTriggeredAtUtc: string | null;
  alertLevel: ReportAlertLevel | null;
  openedAtUtc: string;
  version: number;
};

export type AdminModerationCaseComment = {
  commentPublicId: string;
  articlePublicId: string;
  authorUserId: number;
  content: string;
  status: CommentStatus;
  version: number;
};

export type AdminModerationCaseReport = {
  commentReportPublicId: string;
  reporterUserId: number;
  reasonCode: CommentReportReason;
  description: string | null;
  status: CommentReportStatus;
  createdAtUtc: string;
};

export type AdminModerationCaseDetail = {
  commentModerationCasePublicId: string;
  status: ModerationCaseStatus;
  priority: ModerationCasePriority;
  highestSeverity: ReportSeverity;
  alertTriggeredAtUtc: string | null;
  alertLevel: ReportAlertLevel | null;
  openedAtUtc: string;
  resolvedAtUtc: string | null;
  resolutionType: ModerationCaseResolutionType | null;
  resolutionReasonCode: ModerationReason | null;
  resolutionNote: string | null;
  version: number;
  comment: AdminModerationCaseComment;
  reports: AdminModerationCaseReport[];
};

export type DismissAdminModerationCaseRequest = {
  expectedCaseVersion: number;
  reasonCode: ModerationReason;
  note?: string | null;
};

export type DismissAdminModerationCaseResponse = {
  commentModerationCasePublicId: string;
  status: ModerationCaseStatus;
  resolvedAtUtc: string;
  version: number;
};

export type HideAdminModerationCaseCommentRequest = {
  expectedCaseVersion: number;
  expectedCommentVersion: number;
  reasonCode: ModerationReason;
  note?: string | null;
};

export type HideAdminModerationCaseCommentResponse = {
  commentModerationCasePublicId: string;
  caseStatus: ModerationCaseStatus;
  caseVersion: number;
  commentPublicId: string;
  commentStatus: CommentStatus;
  commentVersion: number;
  resolvedAtUtc: string;
  hiddenAtUtc: string;
};

export type AdminModerationCasesResponse =
  PageInfoPagedResult<AdminModerationCaseItem>;