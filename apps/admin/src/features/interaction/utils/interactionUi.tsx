import { Tag, Typography } from "antd";
import type { CSSProperties } from "react";
import {
  COMMENT_MODERATION_ACTION_TYPE_META,
  COMMENT_REPORT_STATUS_META,
  COMMENT_STATUS_META,
  MODERATION_CASE_PRIORITY_META,
  MODERATION_CASE_RESOLUTION_TYPE_META,
  MODERATION_CASE_STATUS_META,
  MODERATION_REASON,
  REPORT_ALERT_LEVEL_META,
  REPORT_SEVERITY_META,
  type CommentModerationActionType,
  type CommentReportStatus,
  type CommentStatus,
  type ModerationCasePriority,
  type ModerationCaseResolutionType,
  type ModerationCaseStatus,
  type ReportAlertLevel,
  type ReportSeverity,
} from "../constants/interactionConstants";

export const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
};

export const preWrapTextStyle: CSSProperties = {
  ...wrappingTextStyle,
  whiteSpace: "pre-wrap",
};

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function toNullableString(value?: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export function renderOptionalText(value?: string | number | null) {
  return (
    <Typography.Text style={wrappingTextStyle}>
      {value ?? "N/A"}
    </Typography.Text>
  );
}

function renderMetaTag<T extends string>(
  value: T | null | undefined,
  meta: Partial<Record<T, { label: string; badgeClassName?: string }>>,
) {
  if (!value) {
    return <Tag>N/A</Tag>;
  }

  const item = meta[value];

  return (
    <Tag className={item?.badgeClassName}>
      {item?.label ?? value}
    </Tag>
  );
}

export function renderCommentStatusTag(status: CommentStatus) {
  return renderMetaTag(status, COMMENT_STATUS_META);
}

export function renderReportStatusTag(status: CommentReportStatus) {
  return renderMetaTag(status, COMMENT_REPORT_STATUS_META);
}

export function renderModerationCaseStatusTag(status: ModerationCaseStatus) {
  return renderMetaTag(status, MODERATION_CASE_STATUS_META);
}

export function renderPriorityTag(priority: ModerationCasePriority) {
  return renderMetaTag(priority, MODERATION_CASE_PRIORITY_META);
}

export function renderSeverityTag(severity: ReportSeverity) {
  return renderMetaTag(severity, REPORT_SEVERITY_META);
}

export function renderAlertLevelTag(alertLevel?: ReportAlertLevel | null) {
  return renderMetaTag(alertLevel, REPORT_ALERT_LEVEL_META);
}

export function renderActionTypeTag(actionType: CommentModerationActionType) {
  const meta = COMMENT_MODERATION_ACTION_TYPE_META[actionType];

  return <Tag color="processing">{meta?.label ?? actionType}</Tag>;
}

export function renderResolutionTypeTag(
  resolutionType?: ModerationCaseResolutionType | null,
) {
  if (!resolutionType) {
    return <Tag>N/A</Tag>;
  }

  return (
    <Tag color="processing">
      {MODERATION_CASE_RESOLUTION_TYPE_META[resolutionType]?.label ?? resolutionType}
    </Tag>
  );
}

export function renderReasonTag(reason?: string | null) {
  if (!reason) {
    return <Tag>N/A</Tag>;
  }

  return <Tag color={reason === MODERATION_REASON.Other ? "warning" : "default"}>{reason}</Tag>;
}

export function buildCommentPath(commentPublicId: string) {
  return `/interaction/comments/${encodeURIComponent(commentPublicId)}`;
}

export function buildModerationCasePath(casePublicId: string) {
  return `/interaction/moderation-cases/${encodeURIComponent(casePublicId)}`;
}

export function buildArticleInteractionStatsPath(articlePublicId: string) {
  return `/interaction/articles/${encodeURIComponent(articlePublicId)}/stats`;
}
